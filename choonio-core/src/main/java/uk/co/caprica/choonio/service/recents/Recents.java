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

package uk.co.caprica.choonio.service.recents;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.api.model.recents.Recent;

public interface Recents {

    interface Service {
        Flux<Recent> getAllRecents();

        /**
         * Get the recently played history.
         * <p>
         * The history is sorted by reverse timestamp (most recent first) and duplicates are filtered.
         * <p>
         * We do not want to return multiple instances of the same album/artist in the history, we only care about the
         * most recent one.
         *
         * @return recent play action history
         * @param type
         * @param limit
         */
        Flux<Recent> getRecents(MediaType type, Integer limit);

        Mono<Recent> addRecent(Recent playAction);

        /**
         * Delete an item from the recent action history.
         * <p>
         * All items that are equivalent to the one being deleted will also be deleted.
         *
         * @param recentId unique identifier of the item to delete
         * @return delete result
         */
        Mono<Void> removeRecent(String recentId);
    }
}
