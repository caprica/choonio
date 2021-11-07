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

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.request.UpdatePlaylistRequest;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;

import java.util.List;

public interface Playlists {

    interface Service {
        Flux<PlaylistSummary> getPlaylistSummaries();
        Flux<Playlist> getPlaylists();
        Mono<Playlist> getPlaylist(String playlistName);
        Mono<Void> deletePlaylist(String playlistName);
        Mono<Playlist> updatePlaylist(String playlistName, UpdatePlaylistRequest updatePlaylistRequest);
        Mono<Void> addToPlaylist(String playlistName, MediaId mediaId);
        Mono<Void> addArtistToPlaylist(String playlistName, ArtistId artistId);
        Mono<Void> addAlbumToPlaylist(String playlistName, AlbumId albumId);
        Mono<Void> addTrackToPlaylist(String playlistName, TrackId trackId);
        Mono<Void> removeFromPlaylist(String playlistName, String playlistItemId);
        Mono<List<AlbumTrack>> getPlaylistTracks(String playlistName);
    }
}
