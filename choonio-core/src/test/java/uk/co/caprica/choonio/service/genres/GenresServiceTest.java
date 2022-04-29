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

package uk.co.caprica.choonio.service.genres;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.database.model.values.GenreSummary;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GenresServiceTest {

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private GenresService genresService;

    @Test
    void itReturnsGenreSummaries() {
        GenreSummary genre1 = new GenreSummary("Synthwave", 502, 4827);
        GenreSummary genre2 = new GenreSummary("Uplifting", 26, 152);

        when(mongoTemplate.aggregate(any(), eq(GenreSummary.class)))
            .thenReturn(Flux.fromIterable(List.of(
                genre1,
                genre2
            )));

        Flux<GenreSummary> sources = genresService.getGenres();
        StepVerifier.create(sources)
            .expectNext(genre1, genre2)
            .verifyComplete();
    }
}