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

package uk.co.caprica.choonio.service.ratings;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.ratings.Rating;

import java.util.Map;

public interface Ratings {

    interface Service {
        Mono<Void> rateTrack(TrackId trackIdentity, int value);
        Mono<Map<TrackId, Rating>> getAlbumRatings(AlbumId albumIdentity);
        Mono<Map<TrackId, Rating>> getPlaylistRatings(Playlist playlist);
        Flux<Rating> getThumbsUpRatings();
        Flux<Rating> getAllRatings();
    }
}
