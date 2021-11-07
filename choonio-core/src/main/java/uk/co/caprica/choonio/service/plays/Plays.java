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

package uk.co.caprica.choonio.service.plays;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.plays.AlbumListenStats;
import uk.co.caprica.choonio.api.model.plays.ArtistListenStats;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;

import java.time.LocalDate;
import java.util.Map;

public interface Plays {

    interface Service {
        Mono<Play> create(String albumArtistName, String albumName, String trackName);
        Mono<Map<TrackId, TrackListenStats>> getAlbumListens(AlbumId albumIdentity);
        Mono<Map<TrackId, TrackListenStats>> getPlaylistListens(Playlist playlist);
        Flux<ArtistListenStats> getTopArtistListens(int limit);
        Flux<ArtistListenStats> getTopArtistListens(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit);
        Flux<AlbumListenStats> getTopAlbumListens(int limit);
        Flux<AlbumListenStats> getTopAlbumListens(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit);
        Flux<TrackListenStats> getTopTrackListens(int limit);
        Flux<TrackListenStats> getTopTrackListens(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit);
        Flux<Play> getAllPlays();
    }
}
