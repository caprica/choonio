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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.queue.QueueMode;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.mediaplayer.PlayerComponent;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.playlists.PlaylistEnrichment;
import uk.co.caprica.choonio.service.playlists.Playlists;
import uk.co.caprica.choonio.service.recents.Recents;

import java.util.List;

import static uk.co.caprica.choonio.api.model.recents.Recent.newRecent;

/**
 * ExportService implementation for interacting with the global play queue.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class QueueService implements Queue.Service {

    private final Albums.Service albumsService;
    private final Clock.Service clockService;
    private final Playlists.Service playlistsService;
    private final Recents.Service recentsService;

    private final ServerSentEventManager eventManager;

    private final PlayerComponent playerComponent;

    private final PlaylistEnrichment playlistEnrichment;

    @Override
    public Mono<Playlist> getQueue() {
        log.info("getQueue()");
        return Mono.just(playerComponent.getPlaylist())
            .flatMap(playlistEnrichment::enrichPlaylist);
    }

    @Override
    public Mono<Void> clearQueue() {
        log.info("clearQueue()");
        playerComponent.clearQueue();
        return queueChanged();
    }

    @Override
    public Mono<Void> addToQueue(MediaId mediaId, QueueMode queueMode, boolean shuffle) {
        log.info("addToQueue(mediaId={}, queueMode={}, shuffle={})", mediaId, queueMode, shuffle);
        return Mono.when(
            recentsService.addRecent(newRecent(mediaId, clockService.instant())),
            switch (mediaId.getType()) {
                case ARTIST -> addArtist((ArtistId) mediaId, queueMode, shuffle);
                case ALBUM -> addAlbum((AlbumId) mediaId, queueMode, shuffle);
                case TRACK -> addTrack((TrackId) mediaId, queueMode, shuffle);
                case PLAYLIST -> addPlaylist((PlaylistId) mediaId, queueMode, shuffle);
            }
        );
    }

    @Override
    public Mono<Void> randomise(int howMany) {
        log.info("randomise(howMany={})", howMany);
        return albumsService.getRandomTracks(howMany)
            .collectList()
            .flatMap(tracks -> addTracks(tracks, QueueMode.PLAY, false));
    }

    @Override
    public Mono<Void> randomise(List<String> artistNames, long duration) {
        log.info("randomise(artistNames={}, duration={})", artistNames, duration);
        return albumsService.getRandomTracks(artistNames, duration)
            .collectList()
            .flatMap(tracks -> addTracks(tracks, QueueMode.PLAY, false));
    }

    /**
     * Add all the tracks associated with a particular artist to the global play queue.
     *
     * @param artistId identifier of the artist to add
     * @param queueMode queue mode to use when adding to the queue
     * @param shuffle <code>true</code> if the track order should be shuffled before adding the tracks; otherwise <code>false</code>
     * @return
     */
    private Mono<Void> addArtist(ArtistId artistId, QueueMode queueMode, boolean shuffle) {
        log.info("addArtist(artistId={}, queueMode={}, shuffle={})", artistId, queueMode, shuffle);
        return albumsService.getArtistTracks(artistId.getArtistName())
            .collectList()
            .flatMap(tracks -> addTracks(tracks, queueMode, shuffle));
    }

    /**
     * Add all the tracks associated with a particular album to the global play queue.
     *
     * @param albumId identifier of the album to add
     * @param queueMode queue mode to use when adding to the queue
     * @param shuffle <code>true</code> if the track order should be shuffled before adding the tracks; otherwise <code>false</code>
     * @return
     */
    private Mono<Void> addAlbum(AlbumId albumId, QueueMode queueMode, boolean shuffle) {
        log.info("addAlbum(albumId={}, queueMode={}, shuffle={})", albumId, queueMode, shuffle);
        return albumsService.getAlbumTracks(albumId.getAlbumArtistName(), albumId.getAlbumName())
            .collectList()
            .flatMap(tracks -> addTracks(tracks, queueMode, shuffle));
    }

    /**
     * Add a single track to the global play queue.
     *
     * @param trackId identifier of the track to add
     * @param queueMode queue mode to use when adding to the queue
     * @param shuffle <code>true</code> if the track order should be shuffled before adding the tracks; otherwise <code>false</code>
     * @return
     */
    private Mono<Void> addTrack(TrackId trackId, QueueMode queueMode, boolean shuffle) {
        log.info("addTrack(trackId={}, queueMode={}, shuffle={})", trackId, queueMode, shuffle);
        return albumsService.getAlbumTrack(trackId.getAlbumArtistName(), trackId.getAlbumName(), trackId.getTrackName())
            .collectList()
            .flatMap(tracks -> addTracks(tracks, queueMode, shuffle));
    }

    /**
     * Add all of the tracks associated with a particular playlist to the global play queue.
     *
     * @param playlistId identifier of the playlist to add
     * @param queueMode queue mode to use when adding to the queue
     * @param shuffle <code>true</code> if the track order should be shuffled before adding the tracks; otherwise <code>false</code>
     * @return
     */
    private Mono<Void> addPlaylist(PlaylistId playlistId, QueueMode queueMode, boolean shuffle) {
        log.info("addPlaylist(playlistId={}, queueMode={}, shuffle={})", playlistId, queueMode, shuffle);
        return playlistsService.getPlaylistTracks(playlistId.getPlaylistName())
            .flatMap(tracks -> addTracks(tracks, queueMode, shuffle));
    }

    /**
     * Add the requested tracks to the playlist.
     *
     * @param albumTracks collection of tracks to add
     * @param queueMode queue mode to use when adding to the queue
     * @param shuffle <code>true</code> if the track order should be shuffled before adding the tracks; otherwise <code>false</code>
     */
    private Mono<Void> addTracks(List<AlbumTrack> albumTracks, QueueMode queueMode, boolean shuffle) {
        log.info("addTracks(albumTracks={}, queueMode={}, shuffle={})", albumTracks, queueMode, shuffle);
        playerComponent.addToQueue(albumTracks, queueMode, shuffle);
        return queueChanged();
    }

    private Mono<Void> queueChanged() {
        log.info("queueChanged()");
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(CollectionType.QUEUE));
            return Mono.create(MonoSink::success);
        });
    }
}
