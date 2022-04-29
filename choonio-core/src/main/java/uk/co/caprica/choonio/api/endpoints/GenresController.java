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
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.artists.Artist;
import uk.co.caprica.choonio.database.model.values.GenreSummary;
import uk.co.caprica.choonio.service.artists.Artists;
import uk.co.caprica.choonio.service.genres.Genres;

@RestController
@RequestMapping("genres")
@RequiredArgsConstructor
@Slf4j
public class GenresController {

    private final Artists.Service artistsService;
    private final Genres.Service genresService;

    @GetMapping
    public Flux<GenreSummary> getGenres() {
        log.info("getGenres()");
        return genresService.getGenres();
    }

    @GetMapping("{genre}")
    public Flux<Artist> getArtistsForGenre(@PathVariable("genre") String genre) {
        log.info("getArtistsForGenre(genre={})", genre);
        return artistsService.getArtistsForGenre(genre);
    }
}
