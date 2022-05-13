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

package uk.co.caprica.choonio.service.query;

import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.artists.Artist;
import uk.co.caprica.choonio.service.albums.AlbumsService;
import uk.co.caprica.choonio.service.artists.ArtistsService;

@Controller
@RequiredArgsConstructor
public class GraphQLController {

    private final ArtistsService artistsService;
    private final AlbumsService albumsService;

    @QueryMapping
    public Flux<Artist> artists() {
        return artistsService.getArtists();
    }

    @QueryMapping
    public Flux<Album> albums() {
        return albumsService.getAlbums();
    }

    @QueryMapping
    public Flux<Album> albumsByArtist(@Argument String artistName) {
        return albumsService.getAlbums(artistName);
    }

    @QueryMapping
    public Mono<Album> album(@Argument String artistName, @Argument String albumName) {
        return albumsService.getAlbum(artistName, albumName);
    }
}
