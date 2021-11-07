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

package uk.co.caprica.choonio.database.model.values;

import lombok.Value;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;

import java.time.Instant;

@Value
public class PlaylistSummary {
    String id;
    PlaylistId mediaId;
    Instant created;
    Instant updated;

    public static PlaylistSummary newPlaylistSummary(PlaylistId mediaId, Instant created) {
        return new PlaylistSummary(null, mediaId, created, created);
    }
}
