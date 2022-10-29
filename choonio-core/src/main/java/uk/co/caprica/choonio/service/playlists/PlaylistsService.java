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

package uk.co.caprica.choonio.service.playlists;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.api.model.request.PlaylistRequestItem;
import uk.co.caprica.choonio.api.model.request.UpdatePlaylistRequest;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;
import uk.co.caprica.choonio.database.repositories.PlaylistsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;
import static uk.co.caprica.choonio.api.model.playlists.Playlist.newPlaylist;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaylistsService implements Playlists.Service {

    private final Albums.Service albumsService;

    private final Clock.Service clockService;

    private final PlaylistEnrichment playlistEnrichment;

    private final PlaylistsRepository playlistsRepository;

    private final ServerSentEventManager eventManager;

    @Override
    public Flux<PlaylistSummary> getPlaylistSummaries() {
        log.info("getPlaylistNames()");
        // Aggregation may be better than this
        return playlistsRepository.findAllMediaIdPlaylistNameAndCreatedAndUpdatedByOrderByMediaIdPlaylistName();
    }

    @Override
    public Flux<Playlist> getPlaylists() {
        log.info("getPlaylists()");
        return playlistsRepository.findAllByOrderByMediaIdPlaylistName();
    }

    @Override
    public Mono<Playlist> getPlaylist(String playlistName) {
        log.info("getPlaylist(playlistName={})", playlistName);
        return playlistsRepository.findByMediaIdPlaylistName(playlistName)
            .flatMap(playlistEnrichment::enrichPlaylist);
    }

    @Override
    public Mono<Void> deletePlaylist(String playlistName) {
        log.info("deletePlaylist(playlistName={})", playlistName);
        return playlistsRepository.deleteByMediaIdPlaylistName(playlistName)
            .then(playlistsChanged());
    }

    @Override
    public Mono<Playlist> updatePlaylist(String playlistName, UpdatePlaylistRequest updatePlaylistRequest) {
        log.info("updatePlaylist(playlistName={}, updatePlaylistRequest={})", playlistName, updatePlaylistRequest);
        // Get the list of new playlist track ids in desired order, we use this list to preserve the order later - this
        // list is the id only, it contains no details about the track (like the duration) that we will need soon
        List<TrackId> newPlaylistTrackIds = updatePlaylistRequest.getItems().stream()
            .map(PlaylistRequestItem::getTrackId)
            .collect(toList());
        // Start by finding the existing playlist
        return playlistsRepository.findByMediaIdPlaylistName(playlistName)
            // Collect all the tracks referenced by this playlist (that actually exist) into a map keyed by track id
            .flatMap(playlist -> albumsService.getTracks(new HashSet<>(newPlaylistTrackIds))
                .collectMap(AlbumTrack::getMediaId)
                // At this point we have a map of requested tracks that exist, any requested tracks that do not exist
                // are now implicitly skipped
                .map(tracks -> {
                    // With the ordered list of requested track ids, build a list of album tracks in the same order
                    List<AlbumTrack> newPlaylistTracks = newPlaylistTrackIds.stream()
                        .filter(tracks::containsKey)
                        .map(tracks::get)
                        .collect(toList());
                    // Use this list of album tracks to calculate the new total duration for the playlist
                    int duration = newPlaylistTracks.stream()
                        .map(AlbumTrack::getDuration)
                        .reduce(0, Integer::sum);
                    // Convert the list of album tracks into the new playlist items
                    List<PlaylistItem> newPlaylistItems = newPlaylistTracks.stream()
                        .map(AlbumTrack::getMediaId)
                        .map(PlaylistItem::newPlaylistItem)
                        .collect(toList());
                    // Return a new playlist with the valid updated details (this will be silently missing any of the
                    // requested tracks that do not exist)
                    return playlist
                        .withUpdated(clockService.instant())
                        .withDuration(duration)
                        .withItems(newPlaylistItems);
                })
            )
            // Finally, now that we have the updated playlist we persist it and generate an event
            .flatMap(playlistsRepository::save)
            .flatMap(playlist -> playlistsChanged()
                .thenReturn(playlist)
            );
    }

    @Override
    public Mono<Void> addToPlaylist(String playlistName, MediaId mediaId) {
        log.info("addToPlaylist(playlistName={}, mediaId={})", playlistName, mediaId);
        return Mono.when(
            switch (mediaId.getType()) {
                case ARTIST -> addArtistToPlaylist(playlistName, (ArtistId) mediaId);
                case ALBUM -> addAlbumToPlaylist(playlistName, (AlbumId) mediaId);
                case TRACK -> addTrackToPlaylist(playlistName, (TrackId) mediaId);
                default -> throw new IllegalArgumentException(String.format("Can not add media type %s to playlist", mediaId.getType()));
            }
        );
    }

    @Override
    public Mono<Void> addArtistToPlaylist(String playlistName, ArtistId artistId) {
        log.info("addArtistToPlaylist(playlistName={}, artistId={})", playlistName, artistId);
        return albumsService.getArtistTracks(artistId.getArtistName())
            .collectList()
            .flatMap(tracks -> addTracksToPlaylist(playlistName, tracks));
    }

    @Override
    public Mono<Void> addAlbumToPlaylist(String playlistName, AlbumId albumId) {
        log.info("addAlbumToPlaylist(playlistName={}, albumId={})", playlistName, albumId);
        return albumsService.getAlbumTracks(albumId.getAlbumArtistName(), albumId.getAlbumName())
            .collectList()
            .flatMap(tracks -> addTracksToPlaylist(playlistName, tracks));
    }

    @Override
    public Mono<Void> addTrackToPlaylist(String playlistName, TrackId trackId) {
        log.info("addTrackToPlaylist(playlistName={}, trackId={})", playlistName, trackId);
        return albumsService.getAlbumTrack(trackId.getAlbumArtistName(), trackId.getAlbumName(), trackId.getTrackName())
            .collectList()
            .flatMap(tracks -> addTracksToPlaylist(playlistName, tracks));
    }

    @Override
    public Mono<Void> removeFromPlaylist(String playlistName, String playlistItemId) {
        log.info("removeFromPlaylist(playlistName={}, playlistItemId={})", playlistName, playlistItemId);
        return playlistsRepository.findByMediaIdPlaylistName(playlistName)
            .map(playlist -> playlist.withItems(playlist.getItems().stream()
                .filter(playlistItem -> !playlistItem.getId().equals(playlistItemId))
                .collect(toList())
            ))
            .flatMap(this::updatePlaylistDuration)
            .flatMap(playlistsRepository::save)
            .then(playlistsChanged());
    }

    @Override
    public Mono<List<AlbumTrack>> getPlaylistTracks(String playlistName) {
        log.info("getPlaylistTracks(playlistName={})", playlistName);
        return playlistsRepository.findByMediaIdPlaylistName(playlistName)
            .flatMap(this::playlistTracks);
    }

    private Mono<Void> addTracksToPlaylist(String playlistName, List<AlbumTrack> tracks) {
        log.info("addTracksToPlaylist(playlistName={}, tracks={})", playlistName, tracks);
        Instant now = clockService.instant();
        return playlistsRepository.findByMediaIdPlaylistName(playlistName)
            .defaultIfEmpty(newPlaylist(new PlaylistId(playlistName), "My Playlist", now))
            .map(playlist -> playlist
                .withUpdated(now)
                .withItems(Stream.of(playlist.getItems(), playlistItems(tracks))
                    .flatMap(List::stream)
                    .collect(toList())
                )
            )
            .flatMap(this::updatePlaylistDuration)
            .flatMap(playlistsRepository::save)
            .flatMap(unused -> playlistsChanged());
    }

    private Mono<Playlist> updatePlaylistDuration(Playlist playlist) {
        log.info("updatePlaylistDuration(playlist={})", playlist);
        return playlistTracks(playlist)
            .map(albumTracks -> albumTracks.stream()
                .map(AlbumTrack::getDuration)
                .reduce(0, Integer::sum)
            )
            .map(playlist::withDuration);
    }

    private Mono<List<AlbumTrack>> playlistTracks(Playlist playlist) {
        log.info("playlistTracks(playlist={})", playlist);
        Set<TrackId> trackIds = new LinkedHashSet<>(playlist.trackIds());
        return albumsService.getTracks(trackIds)  // Returned order is effectively random
            .collectMap(AlbumTrack::getMediaId)   // So collect to a map
            .map(map -> trackIds.stream()         // Create a list based on the original order
                .map(map::get)
                .collect(toList())
            );
    }

    private List<PlaylistItem> playlistItems(List<AlbumTrack> tracks) {
        return tracks.stream()
            .map(AlbumTrack::getMediaId)
            .map(PlaylistItem::newPlaylistItem)
            .collect(toList());
    }

    private Mono<Void> playlistsChanged() {
        log.info("playlistsChanged()");
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(CollectionType.PLAYLISTS));
            return Mono.create(MonoSink::success);
        });
    }
}
