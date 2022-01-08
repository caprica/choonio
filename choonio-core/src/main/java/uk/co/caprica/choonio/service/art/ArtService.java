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
 */

package uk.co.caprica.choonio.service.art;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.arty.compositor.ArtCompositor;
import uk.co.caprica.arty.generator.ArtGenerator;
import uk.co.caprica.arty.generator.ArtGeneratorProgress;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.art.ArtSize;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.database.model.values.Location;
import uk.co.caprica.choonio.domain.ApplicationStatus;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.StatusChanged;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

import static reactor.core.scheduler.Schedulers.boundedElastic;
import static uk.co.caprica.choonio.database.aggregations.ArtAggregations.albumArtLocation;
import static uk.co.caprica.choonio.database.aggregations.ArtAggregations.albumArtLocations;
import static uk.co.caprica.choonio.database.aggregations.ArtAggregations.artistArtLocation;
import static uk.co.caprica.choonio.database.aggregations.ArtAggregations.mostCommonAlbumsInPlaylist;
import static uk.co.caprica.choonio.database.aggregations.ArtAggregations.trackArtLocation;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArtService implements Art.Service {

    private final ReactiveMongoTemplate mongoTemplate;

    private final ServerSentEventManager eventManager;

    @Value("#{systemProperties['user.home']}/${app.art.covers.directory:.choonio/art}")
    private String artCacheDirectory;

    @Value("${app.art.covers.sourceCoverFilename}")
    private String sourceCoverFilename;

    @Value("${app.art.covers.imageFormat}")
    private String imageFormat;

    @Value("${app.art.playlists.maxGridCells:3}")
    private int maxGridCells;

    @Value("${app.art.covers.bufferSize:196608}")
    private int bufferSize;

    private String coverBaseName;

    @PostConstruct
    void postConstruct() {
        int ext = sourceCoverFilename.lastIndexOf('.');
        coverBaseName = ext != -1 ? sourceCoverFilename.substring(0, ext) : sourceCoverFilename;
    }

    @Override
    public void generateArt(List<String> mediaRoots) {
        log.info("generateArt(mediaRoots={})", mediaRoots);
        int[] sizes = Arrays.stream(ArtSize.values()).mapToInt(ArtSize::size).toArray();
        try {
            for (String mediaRoot : mediaRoots) {
                log.info("mediaRoot={}", mediaRoot);
                ArtGenerator artGenerator = new ArtGenerator(
                    Path.of(mediaRoot),
                    Path.of(artCacheDirectory),
                    sizes,
                    sourceCoverFilename,
                    imageFormat,
                    true
                );
                artGenerator.generateArt(new ArtGeneratorProgress() {
                    @Override
                    public void beforeGenerate(int current, int total, Path filePath) {
                        log.info("Generating {}/{} {}", current, total, filePath);
                        eventManager.emit(new StatusChanged(ApplicationStatus.GENERATE_ARTWORK, (float) current / total));
                    }

                    @Override
                    public void afterGenerate(int current, int total, Path filePath) {
                        log.info(" Generated {}/{} {}", current, total, filePath);
                    }
                });
            }
        } catch (IOException e) {
            log.error("Failure during artwork processing", e);
        }
    }

    @Override
    public Mono<Path> getArtistArtPath(String albumArtistName) {
        log.info("getArtistArtPath(albumArtistName={})", albumArtistName);
        TypedAggregation<Album> aggregation = artistArtLocation(albumArtistName);
        return mongoTemplate.aggregate(aggregation, Location.class)
            .next()
            .map(this::toArtPath);
    }

    @Override
    public Mono<Path> getAlbumArtPath(String albumArtistName, String albumName) {
        log.info("getAlbumArtPath(albumArtistName={}, albumName={})", albumArtistName, albumName);
        TypedAggregation<Album> aggregation = albumArtLocation(new AlbumId(albumArtistName, albumName));
        return mongoTemplate.aggregate(aggregation, Location.class)
            .next()
            .map(this::toArtPath);
    }

    @Override
    public Mono<Path> getTrackArtPath(String albumArtistName, String albumName, String trackName) {
        log.info("getTrackArtPath(albumArtistName={}, albumName={}, trackName={})", albumArtistName, albumName, trackName);
        TypedAggregation<Album> aggregation = trackArtLocation(new TrackId(albumArtistName, albumName, trackName));
        return mongoTemplate.aggregate(aggregation, Location.class)
            .next()
            .map(this::toArtPath);
    }

    @Override
    public Flux<Path> getPlaylistArtPaths(String playlistName) {
        log.info("getPlaylistArtPaths(playlistName={})", playlistName);
        // To make the composite playlist image: first, determine the most common artist and album combinations of all
        // the tracks in the playlist; next, for each of those albums extract the directory location; finally, map those
        // file locations to the source cover art images in the art cache directory
        return mongoTemplate.aggregate(mostCommonAlbumsInPlaylist(playlistName, maxGridCells * maxGridCells), AlbumId.class)
            .collectList()
            .flatMapMany(albumIds -> mongoTemplate.aggregate(albumArtLocations(albumIds), Location.class))
            .map(this::toArtPath);
    }

    @Override
    public Mono<Path> getAutoPlaylistArtPath(String autoPlaylistId) {
        log.info("getAutoPlaylistArtPath(autoPlaylistId={})", autoPlaylistId);
        // Not yet
        return Mono.empty();
    }

    @Override
    public Mono<BufferedImage> getImage(MediaId mediaId, ArtSize artSize) {
        log.info("getImage(mediaId={}, artSize={})", mediaId, artSize);
        Flux<Path> artPaths = switch (mediaId.getType()) {
            case ARTIST -> getArtistArtPath(((ArtistId) mediaId).getArtistName()).flux();
            case ALBUM -> getAlbumArtPath(((AlbumId) mediaId).getAlbumArtistName(), ((AlbumId) mediaId).getAlbumName()).flux();
            case PLAYLIST -> getPlaylistArtPaths(((PlaylistId) mediaId).getPlaylistName());
            case TRACK -> getTrackArtPath(((TrackId) mediaId).getAlbumArtistName(), ((TrackId) mediaId).getAlbumName(), ((TrackId) mediaId).getTrackName()).flux();
        };
        return artPaths
            .map(path -> getCoverArtPath(path, artSize))
            .collectList()
            .flatMap(list -> {
                log.info("list={}", list);
                try {
                    if (list.size() == 0) {
                        log.error("No art for {}", mediaId);
                        return Mono.empty();
                    }
                    if (list.size() == 1) {
                        return Mono.just(ImageIO.read(list.get(0).toFile()));
                    } else {
                        ArtCompositor artCompositor = new ArtCompositor();
                        return Mono.just(artCompositor.compose(list, artSize.size(), maxGridCells));
                    }
                } catch (IOException e) {
                    log.error("Failed to get image for {}", mediaId);
                    return Mono.error(e);
                }
            });
    }

    @Override
    public Mono<byte[]> generateCompositeArt(List<Path> artPaths, ArtSize artSize) {
        log.info("generateCompositeArt(artPaths={}, artSize={})", artPaths, artSize);
        return Mono.fromCallable(() -> {
            ArtCompositor compositor = new ArtCompositor();
            BufferedImage image = compositor.compose(artPaths, artSize.size(), maxGridCells);
            ByteArrayOutputStream bytes = new ByteArrayOutputStream(bufferSize);
            ImageIO.write(image, "jpg", bytes);
            return bytes.toByteArray();
        })
        .subscribeOn(boundedElastic());
    }

    private Path getCoverArtPath(Path artPath, ArtSize artSize) {
        return artPath.resolve(String.format("%s-%d.%s", coverBaseName, artSize.size(), imageFormat));
    }

    // This is the "source" art path, i.e. where cover.jpg is located (with the media files)
    private Path toArtPath(Location albumLocation) {
        Path path = Path.of(albumLocation.getLocation());
        String albumDirectoryName = path.getFileName().toString();
        String artistDirectoryName = path.getParent().getFileName().toString();
        return Path.of(artCacheDirectory, artistDirectoryName, albumDirectoryName);
    }
}
