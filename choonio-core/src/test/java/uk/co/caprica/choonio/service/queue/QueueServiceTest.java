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

package uk.co.caprica.choonio.service.queue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.api.model.queue.QueueMode;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.mediaplayer.PlayerComponent;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.playlists.PlaylistEnrichment;
import uk.co.caprica.choonio.service.playlists.Playlists;
import uk.co.caprica.choonio.service.recents.Recents;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QueueServiceTest {

    @Mock
    private Albums.Service albumsService;

    @Mock
    private Clock.Service clockService;

    @Mock
    private Playlists.Service playlistsService;

    @Mock
    private Recents.Service recentsService;

    @Mock
    private PlaylistEnrichment playlistEnrichment;

    @Mock
    private PlayerComponent playerComponent;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private QueueService queueService;

    @Test
    void itReturnsQueueAsPlaylist() {
        Playlist queue = new Playlist(
            "1",
            new PlaylistId("Queue"),
            "Play queue",
            List.of(new PlaylistItem(
                "101",
                new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
                null
            )),
            8916,
            Instant.parse("2021-09-01T05:05:05.555Z"),
            Instant.parse("2021-09-01T05:05:05.555Z")
        );

        when(playerComponent.getPlaylist()).thenReturn(queue);

        when(playlistEnrichment.enrichPlaylist(eq(queue))).thenReturn(Mono.just(queue));

        Mono<Playlist> source = queueService.getQueue();
        StepVerifier.create(source)
            .expectNext(queue)
            .verifyComplete();
    }

    @Test
    void itClearsQueue() {
        Mono<Void> source = queueService.clearQueue();
        StepVerifier.create(source)
            .verifyComplete();

        verify(playerComponent).clearQueue();
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.QUEUE)));
    }

    @Test
    void itAddsArtistToQueue() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-22T19:02:01.123Z"));

        when(recentsService.addRecent(eq(new Recent(null, new ArtistId("Signal Void"), Instant.parse("2021-10-22T19:02:01.123Z")))))
            .thenReturn(Mono.just(new Recent("1", new ArtistId("Signal Void"), Instant.parse("2021-10-22T19:02:01.123Z"))));

        when(albumsService.getArtistTracks(eq("Signal Void")))
            .thenReturn(Flux.fromIterable(
                List.of(
                    // TODO
                )
            ));

        Mono<Void> source = queueService.addToQueue(new ArtistId("Signal Void"), QueueMode.ADD, false);
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.QUEUE)));
    }

    @Test
    void itAddsAlbumToQueue() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-22T19:02:01.123Z"));

        when(recentsService.addRecent(eq(new Recent(null, new AlbumId("Signal Void", "Jaded Shadow"), Instant.parse("2021-10-22T19:02:01.123Z")))))
            .thenReturn(Mono.just(new Recent("1", new AlbumId("Signal Void", "Jaded Shadow"), Instant.parse("2021-10-22T19:02:01.123Z"))));

        when(albumsService.getAlbumTracks(eq("Signal Void"), eq("Jaded Shadow")))
            .thenReturn(Flux.fromIterable(
                List.of(
                    // TODO
                )
            ));

        Mono<Void> source = queueService.addToQueue(new AlbumId("Signal Void", "Jaded Shadow"), QueueMode.ADD, false);
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.QUEUE)));
    }

    @Test
    void itAddsTrackToQueue() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-22T19:02:01.123Z"));

        when(recentsService.addRecent(eq(new Recent(null, new TrackId("Signal Void", "Jaded Shadow", "Find You"), Instant.parse("2021-10-22T19:02:01.123Z")))))
            .thenReturn(Mono.just(new Recent("1", new TrackId("Signal Void", "Jaded Shadow", "Find You"), Instant.parse("2021-10-22T19:02:01.123Z"))));

        when(albumsService.getAlbumTrack(eq("Signal Void"), eq("Jaded Shadow"), eq("Find You")))
            .thenReturn(Flux.fromIterable(
                List.of(
                    // TODO
                )
            ));

        Mono<Void> source = queueService.addToQueue(new TrackId("Signal Void", "Jaded Shadow", "Find You"), QueueMode.ADD, false);
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.QUEUE)));
    }

    @Test
    void itAddsPlaylistToQueue() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-22T19:02:01.123Z"));

        when(recentsService.addRecent(eq(new Recent(null, new PlaylistId("Only Synthwave"), Instant.parse("2021-10-22T19:02:01.123Z")))))
            .thenReturn(Mono.just(new Recent("1", new PlaylistId("Only Synthwave"), Instant.parse("2021-10-22T19:02:01.123Z"))));

        when(playlistsService.getPlaylistTracks(eq("Only Synthwave")))
            .thenReturn(Mono.just(
                List.of(
                    // TODO
                )
            ));

        Mono<Void> source = queueService.addToQueue(new PlaylistId("Only Synthwave"), QueueMode.ADD, false);
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.QUEUE)));
    }
}
