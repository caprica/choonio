/*
 * This file is part of Choonio.
 *
 * Choonio is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * Choonio is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Choonio.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Copyright 2021-2022 Caprica Software Limited
 */

package uk.co.caprica.choonio.api.endpoints;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.art.ArtSize;
import uk.co.caprica.choonio.service.art.Art;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static java.nio.channels.AsynchronousFileChannel.open;
import static java.nio.file.StandardOpenOption.READ;
import static java.util.stream.Collectors.toList;
import static org.springframework.core.io.buffer.DataBufferUtils.readAsynchronousFileChannel;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ArtController {

    private final DataBufferFactory dataBufferFactory = new DefaultDataBufferFactory();

    private final Art.Service artService;

    @Value("${app.art.covers.sourceCoverFileName:cover.jpg}")
    private String sourceCoverFileName;

    @Value("${app.art.covers.imageFormat:jpg}")
    private String imageFormat;

    @Value("${app.art.covers.cacheControl}")
    private String coversCacheControl;

    @Value("${app.art.covers.bufferSize:196608}")
    private int bufferSize;

    private String coverBaseName;

    @PostConstruct
    private void postConstruct() {
        // Filenames for generated art are derived from the original source art filename (usually cover.jpg)
        coverBaseName = sourceCoverFileName.substring(0, sourceCoverFileName.lastIndexOf('.'));
        log.info("coverBaseName={}", coverBaseName);
    }

    @GetMapping(value = "artists/{artist}/cover-{size}.jpg", produces = MediaType.IMAGE_JPEG_VALUE)
    public Flux<Void> getArtistCover(@PathVariable("artist") String artist, @PathVariable("size") ArtSize size, ServerWebExchange exchange) {
        log.info("getArtistCover(artist={}, size={})", artist, size);
        return artService.getArtistArtPath(artist)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMapMany(artPath -> transferArt(artPath, size, exchange));
    }

    @GetMapping(value = "albums/{artist}/{title}/cover-{size}.jpg", produces = MediaType.IMAGE_JPEG_VALUE)
    public Flux<Void> getAlbumCover(@PathVariable("artist") String artist, @PathVariable("title") String title, @PathVariable("size") ArtSize size, ServerWebExchange exchange) {
        log.info("getAlbumCover(artist={}, title={}, size={})", artist, title, size);
        return artService.getAlbumArtPath(artist, title)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMapMany(artPath -> transferArt(artPath, size, exchange));
    }

    @GetMapping(value = "playlists/{playlistName}/cover-{size}.jpg", produces = MediaType.IMAGE_JPEG_VALUE)
    public Flux<Void> getPlaylistCover(@PathVariable("playlistName") String playlistName, @PathVariable("size") ArtSize size, ServerWebExchange exchange) {
        log.info("getPlaylistCover(playlistName={}, size={})", playlistName, size);
        return artService.getPlaylistArtPaths(playlistName).collectList()
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMapMany(artPaths -> transferArt(artPaths, size, exchange));
    }

    @GetMapping(value = "auto-playlists/{autoPlaylistId}/cover-{size}.jpg", produces = MediaType.IMAGE_JPEG_VALUE)
    public Flux<Void> getAutoPlaylistCover(@PathVariable("autoPlaylistId") String autoPlaylistId, @PathVariable("size") ArtSize size, ServerWebExchange exchange) {
        log.info("getAutoPlaylistCover(autoPlaylistId={}, size={})", autoPlaylistId, size);
        return artService.getAutoPlaylistArtPath(autoPlaylistId)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .flatMapMany(artPath -> transferArt(artPath, size, exchange));
    }

    @GetMapping(value = "genres/{genreName}/cover-{size}.jpg", produces = MediaType.IMAGE_JPEG_VALUE)
    public Flux<Void> getGenreCover(@PathVariable("genreName") String genreName, @PathVariable("size") ArtSize size, ServerWebExchange exchange) {
        log.info("getGenreCover(genreName={}, size={})", genreName, size);
        // Not yet supported
        return Flux.empty();
    }

    private Flux<Void> transferArt(Path artPath, ArtSize artSize, ServerWebExchange exchange) {
        log.info("transferArt(artPath={}, artSize={})", artPath, artSize);
        Path coverPath = getCoverArtPath(artPath, artSize);
        setHeaders(exchange, coverPath);
        return openFile(coverPath).publish(stream -> exchange.getResponse().writeWith(stream));
    }

    private Flux<Void> transferArt(List<Path> artPaths, ArtSize artSize, ServerWebExchange exchange) {
        log.info("transferArt(artPaths={}, artSize={})", artPaths, artSize);
        artPaths = artPaths.stream()
            .map(artPath -> getCoverArtPath(artPath, artSize))
            .collect(toList());
        return artService.generateCompositeArt(artPaths, artSize)
            .flatMapMany(bytes -> {
                setHeaders(exchange, bytes);
                return openImage(bytes).publish(stream -> exchange.getResponse().writeWith(stream));
            });
    }

    private Path getCoverArtPath(Path artPath, ArtSize artSize) {
        return artPath.resolve(String.format("%s-%d.%s", coverBaseName, artSize.size(), imageFormat));
    }

    @SneakyThrows
    private void setHeaders(ServerWebExchange exchange, Path coverFile) {
        exchange.getResponse().getHeaders().set(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE);
        exchange.getResponse().getHeaders().set(HttpHeaders.CACHE_CONTROL, coversCacheControl);
        exchange.getResponse().getHeaders().set(HttpHeaders.CONTENT_LENGTH, Long.toString(Files.size(coverFile)));
        exchange.getResponse().getHeaders().set(HttpHeaders.LAST_MODIFIED, Long.toString(Files.getLastModifiedTime(coverFile).toMillis()));
    }

    private void setHeaders(ServerWebExchange exchange, byte[] buffer) {
        exchange.getResponse().getHeaders().set(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE);
        exchange.getResponse().getHeaders().set(HttpHeaders.CACHE_CONTROL, coversCacheControl);
        exchange.getResponse().getHeaders().set(HttpHeaders.CONTENT_LENGTH, Integer.toString(buffer.length));
    }

    private Flux<DataBuffer> openFile(Path path) {
        log.info("openFile(path={})", path);
        return readAsynchronousFileChannel(() -> open(path, READ), dataBufferFactory, bufferSize);
    }

    private Flux<DataBuffer> openImage(byte[] bytes) {
        log.info("openImage(bytes=[{}])", bytes.length);
        return DataBufferUtils.readInputStream(() -> new ByteArrayInputStream(bytes), new DefaultDataBufferFactory(), bufferSize);
    }
}
