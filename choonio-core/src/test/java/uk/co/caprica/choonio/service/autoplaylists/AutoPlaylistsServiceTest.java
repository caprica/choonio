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

package uk.co.caprica.choonio.service.autoplaylists;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;
import uk.co.caprica.choonio.service.autoplaylists.providers.AutoPlaylistProvider;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.util.Map;
import java.util.Set;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutoPlaylistsServiceTest {

    @Mock
    private Clock.Service clockService;

    @Mock
    private Map<String, AutoPlaylistProvider> providers;

    @InjectMocks
    private AutoPlaylistsService autoPlaylistsService;

    @Test
    void itReturnsAutoPlaylistSummaries() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-28T19:22:07.331Z"));

        PlaylistSummary summary1 = new PlaylistSummary(
            null,
            new PlaylistId("Thumbs up"),
            Instant.parse("2021-10-28T19:22:07.331Z"),
            Instant.parse("2021-10-28T19:22:07.331Z")
        );

        when(providers.keySet())
            .thenReturn(Set.of("Thumbs up"));

        Flux<PlaylistSummary> source = autoPlaylistsService.getAutoPlaylistSummaries();
        StepVerifier.create(source)
            .expectNext(summary1)
            .verifyComplete();
    }
}