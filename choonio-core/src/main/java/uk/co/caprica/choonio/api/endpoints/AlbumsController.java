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

package uk.co.caprica.choonio.api.endpoints;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.service.albums.Albums;

@RestController
@RequestMapping("albums")
@RequiredArgsConstructor
@Slf4j
public class AlbumsController {

    private final Albums.Service albumsService;

    @GetMapping
    public Flux<Album> getAlbums() {
        log.info("getAlbums()");
        return albumsService.getAlbums();
    }

    @GetMapping("{artist}")
    public Flux<Album> getAlbums(@PathVariable("artist") String artist) {
        log.info("getAlbums(artist={})", artist);
        return albumsService.getAlbums(artist)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    @GetMapping("{artist}/{title}")
    public Mono<Album> getAlbum(@PathVariable("artist") String artist, @PathVariable("title") String title) {
        log.info("getAlbum(artist={}, title={})", artist, title);
        return albumsService.getAlbum(artist, title)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }
}
