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
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.albums.TrackStats;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.Ratings;

import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;
import static uk.co.caprica.choonio.api.model.albums.RatingValue.ratingValue;

@Component
@RequiredArgsConstructor
@Slf4j
public class PlaylistEnrichment {

    private final Albums.Service albumsService;
    private final Plays.Service playsService;
    private final Ratings.Service ratingsService;

    public Mono<Playlist> enrichPlaylist(Playlist playlist) {
        log.info("enrichPlaylist(playlist={})", playlist);
        return Mono.zip(
            getPlaylistTracks(playlist),
            playsService.getPlaylistListens(playlist),
            ratingsService.getPlaylistRatings(playlist)
        ).map(results -> enrichPlaylist(playlist, results.getT1(), results.getT2(), results.getT3()));
    }

    private Mono<Map<TrackId, AlbumTrack>> getPlaylistTracks(Playlist playlist) {
        return albumsService.getTracks(new HashSet<>(playlist.trackIds()))
            .collectMap(AlbumTrack::getMediaId);
    }

    private Playlist enrichPlaylist(Playlist playlist, Map<TrackId, AlbumTrack> tracks, Map<TrackId, TrackListenStats> listens, Map<TrackId, Rating> ratings) {
        playlist = applyTracks(playlist, tracks);
        playlist = applyStats(playlist, listens, ratings);
        return playlist;
    }

    private static Playlist applyTracks(Playlist playlist, Map<TrackId, AlbumTrack> tracks) {
        List<PlaylistItem> enrichedItems = playlist.getItems().stream()
            .map(playlistItem -> playlistItem.withTrack(tracks.get(playlistItem.getMediaId())))
            .collect(toList());
        return playlist.withItems(enrichedItems);
    }

    private static Playlist applyStats(Playlist playlist, Map<TrackId, TrackListenStats> listens, Map<TrackId, Rating> ratings) {
        List<PlaylistItem> enrichedItems = playlist.getItems().stream()
            .map(item -> item.withTrack(
                item.getTrack().withStats(
                    getStats(item.getMediaId(), listens, ratings))
                )
            )
            .collect(toList());
        return playlist.withItems(enrichedItems);
    }

    private static TrackStats getStats(TrackId trackId, Map<TrackId, TrackListenStats> listens, Map<TrackId, Rating> ratings) {
        TrackListenStats trackListens = listens.get(trackId);
        Rating trackRating = ratings.get(trackId);
        return new TrackStats(
            trackListens != null ? trackListens.getListens() : 0,
            ratingValue(trackRating != null ? trackRating.getValue() : 0)
        );
    }
}
