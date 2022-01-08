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

package uk.co.caprica.choonio.service.playlists;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;
import uk.co.caprica.choonio.database.repositories.PlaylistsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.util.List;

import static java.util.Collections.emptyList;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlaylistsServiceTest {

    @Mock
    private Albums.Service albumsService;

    @Mock
    private Clock.Service clockService;

    @Mock
    private PlaylistsRepository playlistsRepository;

    @Mock
    private PlaylistEnrichment playlistEnrichment;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private PlaylistsService playlistsService;

    @Test
    void itReturnsPlaylistSummaries() {
        PlaylistSummary summary1 = new PlaylistSummary(
            "1",
            new PlaylistId("Synthwave"),
            Instant.parse("2021-10-28T19:22:07.331Z"),
            Instant.parse("2021-10-28T19:28:12.409Z")
        );

        PlaylistSummary summary2 = new PlaylistSummary(
            "2",
            new PlaylistId("More Synthwave"),
            Instant.parse("2021-10-29T14:12:52.702Z"),
            Instant.parse("2021-10-30T18:17:43.439Z")
        );

        when(playlistsRepository.findAllMediaIdPlaylistNameAndCreatedAndUpdatedByOrderByMediaIdPlaylistName())
            .thenReturn(Flux.fromIterable(List.of(summary1, summary2)));

        Flux<PlaylistSummary> source = playlistsService.getPlaylistSummaries();
        StepVerifier.create(source)
            .expectNext(summary1, summary2)
            .verifyComplete();
    }

    @Test
    void itReturnsPlaylists() {
        Playlist playlist1 = new Playlist("1", new PlaylistId("Synthwave"), "The best genre", emptyList(), 1234, Instant.parse("2021-10-16T10:11:12.130Z"), Instant.parse("2021-10-16T10:15:01.333Z"));
        Playlist playlist2 = new Playlist("2", new PlaylistId("More Synthwave"), "More from the best genre", emptyList(), 4321, Instant.parse("2021-10-18T12:27:32.144Z"), Instant.parse("2021-10-19T08:45:01.979Z"));

        when(playlistsRepository.findAllByOrderByMediaIdPlaylistName())
            .thenReturn(Flux.fromIterable(List.of(playlist1, playlist2)));

        Flux<Playlist> source = playlistsService.getPlaylists();
        StepVerifier.create(source)
            .expectNext(playlist1, playlist2)
            .verifyComplete();
    }

    @Test
    void itDeletesPlaylist() {
        when(playlistsRepository.deleteByMediaIdPlaylistName(eq("Not Synthwave")))
            .thenReturn(Mono.create(MonoSink::success));

        Mono<Void> source = playlistsService.deletePlaylist("Not Synthwave");
        StepVerifier.create(source)
            .verifyComplete();
    }

    @Test
    void itAddsArtistToPlaylist() {
        Playlist playlist = scenario();

        AlbumTrack track1 = new AlbumTrack(
            new TrackId("Neon Nox", "Last Stand", "Recon"),
            1,
            "Neon Nox",
            236,
            null,
            null
        );

        AlbumTrack track2 = new AlbumTrack(
            new TrackId("Ray Gun Hero", "Plethora", "Across the Grid"),
            1,
            "Ray Gun Hero",
            319,
            null,
            null
        );

        AlbumTrack track3 = new AlbumTrack(
            new TrackId("Destryur", "Panic", "Killing Demons"),
            1,
            "Destryur",
            183,
            null,
            null
        );

        when(albumsService.getArtistTracks(eq("Destryur")))
            .thenReturn(Flux.fromIterable(List.of(track3)));

        when(clockService.instant()).thenReturn(Instant.parse("2021-10-29T08:52:40.007Z"));

        when(playlistsRepository.findByMediaIdPlaylistName(eq("Synthwave")))
            .thenReturn(Mono.just(playlist));

        when(albumsService.getTracks(any())).thenReturn(Flux.fromIterable(List.of(track1, track2, track3)));

        when(playlistsRepository.save(any())).thenReturn(Mono.just(playlist));

        Mono<Void> source = playlistsService.addToPlaylist("Synthwave", new ArtistId("Destryur"));
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.PLAYLISTS)));
    }

    @Test
    void itAddsAlbumToPlaylist() {
        Playlist playlist = scenario();

        AlbumTrack track1 = new AlbumTrack(
            new TrackId("Neon Nox", "Last Stand", "Recon"),
            1,
            "Neon Nox",
            236,
            null,
            null
        );

        AlbumTrack track2 = new AlbumTrack(
            new TrackId("Ray Gun Hero", "Plethora", "Across the Grid"),
            1,
            "Ray Gun Hero",
            319,
            null,
            null
        );

        AlbumTrack track3 = new AlbumTrack(
            new TrackId("Destryur", "Panic", "Killing Demons"),
            1,
            "Destryur",
            183,
            null,
            null
        );

        when(albumsService.getAlbumTracks(eq("Destryur"), eq("Panic")))
            .thenReturn(Flux.fromIterable(List.of(track3)));

        when(clockService.instant()).thenReturn(Instant.parse("2021-10-29T08:52:40.007Z"));

        when(playlistsRepository.findByMediaIdPlaylistName(eq("Synthwave")))
            .thenReturn(Mono.just(playlist));

        when(albumsService.getTracks(any())).thenReturn(Flux.fromIterable(List.of(track1, track2, track3)));

        when(playlistsRepository.save(any())).thenReturn(Mono.just(playlist));

        Mono<Void> source = playlistsService.addToPlaylist("Synthwave", new AlbumId("Destryur", "Panic"));
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.PLAYLISTS)));
    }

    @Test
    void itAddsTrackToPlaylist() {
        Playlist playlist = scenario();

        AlbumTrack track1 = new AlbumTrack(
            new TrackId("Neon Nox", "Last Stand", "Recon"),
            1,
            "Neon Nox",
            236,
            null,
            null
        );

        AlbumTrack track2 = new AlbumTrack(
            new TrackId("Ray Gun Hero", "Plethora", "Across the Grid"),
            1,
            "Ray Gun Hero",
            319,
            null,
            null
        );

        AlbumTrack track3 = new AlbumTrack(
            new TrackId("Destryur", "Panic", "Killing Demons"),
            1,
            "Destryur",
            183,
            null,
            null
        );

        when(albumsService.getAlbumTrack(eq("Destryur"), eq("Panic"), eq("Killing Demons")))
            .thenReturn(Flux.fromIterable(List.of(track3)));

        when(clockService.instant()).thenReturn(Instant.parse("2021-10-29T08:52:40.007Z"));

        when(playlistsRepository.findByMediaIdPlaylistName(eq("Synthwave")))
            .thenReturn(Mono.just(playlist));

        when(albumsService.getTracks(any())).thenReturn(Flux.fromIterable(List.of(track1, track2, track3)));

        when(playlistsRepository.save(any())).thenReturn(Mono.just(playlist));

        Mono<Void> source = playlistsService.addToPlaylist("Synthwave", new TrackId("Destryur", "Panic", "Killing Demons"));
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.PLAYLISTS)));
    }

    @Test
    void itDoesNotAddInvalidMediaTypeToPlaylist() {
        assertThrows(IllegalArgumentException.class, () -> playlistsService.addToPlaylist("Synthwave", new PlaylistId("More synthwave")));
    }

    @Test
    void itRemovesFromPlaylist() {
        Playlist playlist = scenario();

        AlbumTrack track2 = new AlbumTrack(
            new TrackId("Ray Gun Hero", "Plethora", "Across the Grid"),
            2,
            "Ray Gun Hero",
            318,
            null,
            null
        );

        when(playlistsRepository.findByMediaIdPlaylistName("Synthwave"))
            .thenReturn(Mono.just(playlist));

        when(albumsService.getTracks(any())).thenReturn(Flux.fromIterable(List.of(track2)));

        when(playlistsRepository.save(any())).thenReturn(Mono.just(playlist));

        Mono<Void> source = playlistsService.removeFromPlaylist("Synthwave", "11");
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.PLAYLISTS)));
    }

    @Test
    void itGetsPlaylistTracks() {
        Playlist playlist = scenario();

        AlbumTrack track1 = new AlbumTrack(
            new TrackId("Neon Nox", "Last Stand", "Recon"),
            1,
            "Neon Nox",
            235,
            null,
            null
        );

        AlbumTrack track2 = new AlbumTrack(
            new TrackId("Ray Gun Hero", "Plethora", "Across the Grid"),
            2,
            "Ray Gun Hero",
            318,
            null,
            null
        );

        when(playlistsRepository.findByMediaIdPlaylistName(eq("Synthwave")))
            .thenReturn(Mono.just(playlist));

        when(albumsService.getTracks(any()))
            .thenReturn(Flux.fromIterable(List.of(
                track1,
                track2
            )));

        Mono<List<AlbumTrack>> source = playlistsService.getPlaylistTracks("Synthwave");
        StepVerifier.create(source)
            .expectNext(List.of(track1, track2))
            .verifyComplete();
    }

    private static Playlist scenario() {
        return new Playlist(
            "1",
            new PlaylistId("Synthwave"),
            "The best genre",
            List.of(
                new PlaylistItem(
                    "11",
                    new TrackId("Neon Nox", "Last Stand", "Recon"),
                    null
                ),
                new PlaylistItem(
                    "12",
                    new TrackId("Ray Gun Hero", "Plethora", "Across the Grid"),
                    null
                )
            ),
            0,
            Instant.parse("2021-09-15T08:49:23.545Z"),
            Instant.parse("2021-10-17T18:25:51.421Z")
        );
    }
}
