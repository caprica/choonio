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

package uk.co.caprica.choonio.service.highlights.providers.recent;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
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
class ArtistRecentHighlightProviderTest {

    @Mock
    private Clock.Service clockService;

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private ArtistRecentHighlightProvider highlightProvider;

    @Test
    void itReturnsHighlights() {
        ReflectionTestUtils.setField(highlightProvider, "recentDays", 7);

        Recent recent1 = new Recent("1", new ArtistId("STRNGR & Destryur"), Instant.parse("2020-04-24T10:20:30.456Z"));
        Recent recent2 = new Recent("2", new ArtistId("Ray Gun Hero"), Instant.parse("2020-04-25T09:59:11.204Z"));

        when(clockService.localDate()).thenReturn(LocalDate.parse("2020-04-28"));

        when(mongoTemplate.aggregate(any(), eq(Recent.class)))
            .thenReturn(Flux.fromIterable(List.of(
                recent1,
                recent2
            )));

        Flux<Highlight> source = highlightProvider.getHighlights();
        StepVerifier.create(source)
            .expectNext(new Highlight(null, "Recent", "You've listened to STRNGR & Destryur recently", new ArtistId("STRNGR & Destryur"), null, null))
            .expectNext(new Highlight(null, "Recent", "You've listened to Ray Gun Hero recently", new ArtistId("Ray Gun Hero"), null, null))
            .verifyComplete();
    }

    @Test
    void itReturnsType() {
        assertEquals("Recent", highlightProvider.getType());
    }
}
