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

package uk.co.caprica.choonio.api.model.highlights;

import lombok.Value;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import uk.co.caprica.choonio.api.model.identity.MediaId;

import java.time.Instant;

@Document("highlight")
@Value
public class Highlight {
    @Id String id;
    String type;
    String message;
    @Indexed(unique = true) MediaId mediaId;
    @With int[] rgb;
    @With @Indexed Instant timestamp;

    public static Highlight newHighlight(String type, String message, MediaId mediaId, int[] rgb, Instant timestamp) {
        return new Highlight(null, type, message, mediaId, rgb, timestamp);
    }
}
