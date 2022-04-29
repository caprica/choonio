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

package uk.co.caprica.choonio.service.artists;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.artists.Artist;

import static uk.co.caprica.choonio.database.aggregations.ArtistAggregations.artistSummaries;
import static uk.co.caprica.choonio.database.aggregations.ArtistAggregations.artistSummariesForGenre;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArtistsService implements Artists.Service {

    private final ReactiveMongoTemplate mongoTemplate;

    @Override
    public Flux<Artist> getArtists() {
        log.info("getArtists()");
        return mongoTemplate.aggregate(artistSummaries(), Artist.class);
    }

    @Override
    public Flux<Artist> getArtistsForGenre(String genre) {
        log.info("getArtistsForGenre(genre={})", genre);
        return mongoTemplate.aggregate(artistSummariesForGenre(genre), Artist.class);
    }
}
