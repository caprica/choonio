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

package uk.co.caprica.choonio.service.highlights.providers.dayofweek;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlbumDayOfWeekHighlightProviderTest {

    @Mock
    private Clock.Service clockService;

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private AlbumDayOfWeekHighlightProvider highlightProvider;

    @Test
    void itReturnsHighlights() {
        when(clockService.localDate()).thenReturn(LocalDate.parse("2021-10-28"));

        Recent recent1 = new Recent("1", new AlbumId("STRNGR & Destryur", "Night at the Grindhouse"), Instant.parse("2020-04-24T10:20:30.456Z"));
        Recent recent2 = new Recent("2", new AlbumId("Ray Gun Hero", "Plethora"), Instant.parse("2020-04-25T09:59:11.204Z"));

        when(mongoTemplate.aggregate(any(), eq(Recent.class)))
            .thenReturn(Flux.fromIterable(List.of(
                recent1,
                recent2
            )));

        Flux<Highlight> source = highlightProvider.getHighlights();
        StepVerifier.create(source)
            .expectNext(new Highlight(null, "Day of week", "You've listened to Night at the Grindhouse on Thursday", new AlbumId("STRNGR & Destryur", "Night at the Grindhouse"), null, null))
            .expectNext(new Highlight(null, "Day of week", "You've listened to Plethora on Thursday", new AlbumId("Ray Gun Hero", "Plethora"), null, null))
            .verifyComplete();
    }

    @Test
    void itReturnsType() {
        assertEquals("Day of week", highlightProvider.getType());
    }
}
