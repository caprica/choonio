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

package uk.co.caprica.choonio.api.model.ratings;

import lombok.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import uk.co.caprica.choonio.api.model.identity.TrackId;

import java.time.Instant;

@Document("rating")
@Value
public class Rating {
    @Id String id;
    @Indexed(unique = true) TrackId mediaId;
    @Indexed int value;
    @Indexed(direction = IndexDirection.DESCENDING) Instant timestamp;

    public static Rating newRating(TrackId mediaId, int value, Instant when) {
        return new Rating(null, mediaId, value, when);
    }
}
