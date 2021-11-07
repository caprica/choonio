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

package uk.co.caprica.choonio.service.highlights;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.database.repositories.HighlightsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.art.Art;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readBufferedImageResource;

@ExtendWith(MockitoExtension.class)
class HighlightsServiceTest {

    @Mock
    private Art.Service artService;

    @Mock
    private Clock.Service clockService;

    @Mock
    private HighlightsRepository highlightsRepository;

    @Mock
    private List<HighlightProvider> highlightProviders;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private HighlightsService highlightsService;

    @BeforeEach
    void beforeEach() {
        ReflectionTestUtils.setField(highlightsService, "autoRefreshThresholdMinutes", 5);
    }

    @Test
    void itReturnsHighlights() {
        Highlight highlight1 = new Highlight(
            "1",
            "favourite artist",
            "Destryur is a favourite artist",
            new ArtistId("Destryur"),
            new int[] { 1, 2, 3 },
            Instant.parse("2021-10-26T18:24:52.611Z")
        );
        Highlight highlight2 = new Highlight(
            "1",
            "favourite album",
            "Sleepwalking by NINA is a favourite album",
            new AlbumId("NINA", "Sleepwalking"),
            new int[] { 3, 2, 1 },
            Instant.parse("2021-10-27T10:45:22.843Z")
        );

        when(highlightsRepository.findAll()).thenReturn(Flux.fromIterable(List.of(
            highlight1,
            highlight2
        )));

        Flux<Highlight> source = highlightsService.getHighlights();
        StepVerifier.create(source)
            .expectNext(highlight1, highlight2)
            .verifyComplete();
    }

    @Test
    void itReturnsTrueWhenAutoRefreshDue() {
        when(highlightsRepository.findFirstByOrderByTimestampDesc()).thenReturn(Mono.just(
            new Highlight(
                "1",
                "favourite artist",
                "Destryur is a favourite artist",
                new ArtistId("Destryur"),
                new int[] { 1, 2, 3 },
                Instant.parse("2021-10-26T18:24:52.611Z")
            )
        ));
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-26T18:29:52.612Z"));

        Mono<Boolean> source = highlightsService.autoRefreshDue();
        StepVerifier.create(source)
            .expectNext(Boolean.TRUE)
            .verifyComplete();
    }

    @Test
    void itReturnsFalseWhenAutoRefreshNotDue() {
        when(highlightsRepository.findFirstByOrderByTimestampDesc()).thenReturn(Mono.just(
            new Highlight(
                "1",
                "favourite artist",
                "Destryur is a favourite artist",
                new ArtistId("Destryur"),
                new int[] { 1, 2, 3},
                Instant.parse("2021-10-26T18:24:52.611Z")
            )
        ));
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-26T18:24:53.104Z"));

        Mono<Boolean> source = highlightsService.autoRefreshDue();
        StepVerifier.create(source)
            .expectNext(Boolean.FALSE)
            .verifyComplete();
    }

    @Test
    void itRefreshesHighlights() {
        int wantedHighlights = 3;

        ReflectionTestUtils.setField(highlightsService, "maximumHighlights", wantedHighlights);

        HighlightProvider provider1 = new HighlightProvider() {
            @Override
            public String getType() {
                return "Test 1";
            }

            @Override
            public Flux<Highlight> getHighlights() {
                return Flux.fromIterable(List.of(
                    new Highlight("11", "Test 1", "The first highlight", new ArtistId("Neon Nox"), null, null),
                    new Highlight("12", "Test 1", "The second highlight", new ArtistId("Signal Void"), null, null),
                    new Highlight("13", "Test 1", "The third highlight", new ArtistId("Destryur"), null, null),
                    new Highlight("14", "Test 1", "The fourth highlight", new ArtistId("DEADLIFE"), null, null)
                ));
            }
        };

        HighlightProvider provider2 = new HighlightProvider() {
            @Override
            public String getType() {
                return "Test 2";
            }

            @Override
            public Flux<Highlight> getHighlights() {
                return Flux.fromIterable(List.of(
                    new Highlight("21", "Test 2", "The first highlight", new AlbumId("Neon Nox", "Last Stand"), null, null),
                    new Highlight("22", "Test 2", "The second highlight", new AlbumId("Signal Void", "Jaded Shadow"), null, null),
                    new Highlight("23", "Test 2", "The third highlight", new AlbumId("Destryur", "Panic"), null, null),
                    new Highlight("24", "Test 2", "The fourth highlight", new AlbumId("DEADLIFE", "God in the Machine"), null, null)
                ));
            }
        };

        when(highlightProviders.iterator())
            .thenReturn(
                List.of(
                    provider1,
                    provider2
                )
                .iterator()
            );

        when(highlightsRepository.deleteAll())
            .thenReturn(Mono.create(MonoSink::success));

        when(highlightsRepository.save(any()))
            .thenReturn(Mono.create(MonoSink::success));

        when(artService.getImage(any(), any()))
            .thenReturn(Mono.just(readBufferedImageResource(getClass(), "test.jpg")));

        Mono<Void> source = highlightsService.refreshHighlights();
        StepVerifier.create(source)
            .verifyComplete();

        verify(highlightsRepository).deleteAll();
        verify(highlightsRepository, times(wantedHighlights)).save(any());
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.HIGHLIGHTS)));
    }
}
