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

package uk.co.caprica.choonio.service.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.search.CombinedSearchResults;
import uk.co.caprica.choonio.api.model.search.SearchResult;
import uk.co.caprica.choonio.api.model.search.SearchResults;
import uk.co.caprica.choonio.service.search.model.SearchRequest;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private SearchService searchService;

    @Test
    void itReturnsSearchResults() {
        ReflectionTestUtils.setField(searchService, "maxLimit", 100);

        SearchRequest searchRequest = new SearchRequest(
            "neon",
            10
        );

        when(mongoTemplate.aggregate(any(), eq(Album.class), eq(ArtistId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new ArtistId("Neon Nox")
            )));

        when(mongoTemplate.aggregate(any(), eq(Album.class), eq(AlbumId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new AlbumId("Wayfloe", "Neon West Zero"),
                new AlbumId("D-Noise", "Neon Drive")
            )));

        when(mongoTemplate.aggregate(any(), eq(Album.class), eq(TrackId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new TrackId("F.O.O.L", "Time Spender", "Neon"),
                new TrackId("Lazerhawk", "Dreamrider", "Neon Dawn"),
                new TrackId("Timecop1983", "Night Drive", "Neon Lights")
            )));

        when(mongoTemplate.aggregate(any(), eq(Playlist.class), eq(PlaylistId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new PlaylistId("Neon, Midnight, Synths")
            )));

        Mono<CombinedSearchResults> source = searchService.search(searchRequest);
        StepVerifier.create(source)
            .expectNext(searchResults())
            .verifyComplete();
    }

    @Test
    void itLimitsMaxResults() {
        ReflectionTestUtils.setField(searchService, "maxLimit", 1);

        SearchRequest searchRequest = new SearchRequest(
            "neon",
            10
        );

        when(mongoTemplate.aggregate(any(), eq(Album.class), eq(ArtistId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new ArtistId("Neon Nox")
            )));

        when(mongoTemplate.aggregate(any(), eq(Album.class), eq(AlbumId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new AlbumId("Wayfloe", "Neon West Zero"),
                new AlbumId("D-Noise", "Neon Drive")
            )));

        when(mongoTemplate.aggregate(any(), eq(Album.class), eq(TrackId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new TrackId("F.O.O.L", "Time Spender", "Neon"),
                new TrackId("Lazerhawk", "Dreamrider", "Neon Dawn"),
                new TrackId("Timecop1983", "Night Drive", "Neon Lights")
            )));

        when(mongoTemplate.aggregate(any(), eq(Playlist.class), eq(PlaylistId.class)))
            .thenReturn(Flux.fromIterable(List.of(
                new PlaylistId("Neon, Midnight, Synths")
            )));

        Mono<CombinedSearchResults> source = searchService.search(searchRequest);
        StepVerifier.create(source)
            .expectNext(limitedSearchResults())
            .verifyComplete();
    }

    private static CombinedSearchResults searchResults() {
        return new CombinedSearchResults(
            "neon",
            10,
            new SearchResults(1, List.of(
                new SearchResult(new ArtistId("Neon Nox"), 0.5f)
            )),
            new SearchResults(2, List.of(
                new SearchResult(new AlbumId("D-Noise", "Neon Drive"), 0.39999998f),
                new SearchResult(new AlbumId("Wayfloe", "Neon West Zero"), 0.28571427f)
            )),
            new SearchResults(3, List.of(
                new SearchResult(new TrackId("F.O.O.L", "Time Spender", "Neon"), 1.0f),
                new SearchResult(new TrackId("Lazerhawk", "Dreamrider", "Neon Dawn"), 0.44444442f),
                new SearchResult(new TrackId("Timecop1983", "Night Drive", "Neon Lights"), 0.36363637f)
            )),
            new SearchResults(1, List.of(
                new SearchResult(new PlaylistId("Neon, Midnight, Synths"), 0.18181819f)
            ))
        );
    }

    private static CombinedSearchResults limitedSearchResults() {
        return new CombinedSearchResults(
            "neon",
            10,
            new SearchResults(1, List.of(
                new SearchResult(new ArtistId("Neon Nox"), 0.5f)
            )),
            new SearchResults(1, List.of(
                new SearchResult(new AlbumId("D-Noise", "Neon Drive"), 0.39999998f)
            )),
            new SearchResults(1, List.of(
                new SearchResult(new TrackId("F.O.O.L", "Time Spender", "Neon"), 1.0f)
            )),
            new SearchResults(1, List.of(
                new SearchResult(new PlaylistId("Neon, Midnight, Synths"), 0.18181819f)
            ))
        );
    }
}