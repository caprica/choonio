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

package uk.co.caprica.choonio.service.highlights.providers.favourite;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.ArtistId;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArtistFavouriteHighlightProviderTest {

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private ArtistFavouriteHighlightProvider highlightProvider;

    @Test
    void itReturnsHighlights() {
        Favourite favourite1 = new Favourite("1", new ArtistId("STRNGR & Destryur"), Instant.parse("2020-04-24T10:20:30.456Z"));
        Favourite favourite2 = new Favourite("2", new ArtistId("Ray Gun Hero"), Instant.parse("2020-04-25T09:59:11.204Z"));

        when(mongoTemplate.aggregate(any(), eq(Favourite.class)))
            .thenReturn(Flux.fromIterable(List.of(
                favourite1,
                favourite2
            )));

        Flux<Highlight> source = highlightProvider.getHighlights();
        StepVerifier.create(source)
            .expectNext(new Highlight(null, "Favourite", "STRNGR & Destryur is a favourite artist", new ArtistId("STRNGR & Destryur"), null, null))
            .expectNext(new Highlight(null, "Favourite", "Ray Gun Hero is a favourite artist", new ArtistId("Ray Gun Hero"), null, null))
            .verifyComplete();
    }

    @Test
    void itReturnsType() {
        assertEquals("Favourite", highlightProvider.getType());
    }
}
