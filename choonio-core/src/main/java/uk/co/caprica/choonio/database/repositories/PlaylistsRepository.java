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

package uk.co.caprica.choonio.database.repositories;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;

public interface PlaylistsRepository extends ReactiveMongoRepository<Playlist, String> {
    Flux<Playlist> findAllByOrderByMediaIdPlaylistName();
    Mono<Playlist> findByMediaIdPlaylistName(String name);
    Mono<Void> deleteByMediaIdPlaylistName(String name);
    Flux<PlaylistSummary> findAllMediaIdPlaylistNameAndCreatedAndUpdatedByOrderByMediaIdPlaylistName();
}
