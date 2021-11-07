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

package uk.co.caprica.choonio.api.model.albums;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Value;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Document("album")
@Value
public class Album {
    @Id String id;
    @Indexed(unique = true) AlbumId mediaId;
    @Indexed Integer year;
    @Indexed String genre;
    @With List<AlbumTrack> tracks;
    int duration;
    int[] rgb;
    Instant timestamp;
    @JsonIgnore String location;

    public AlbumTrack albumTrack(TrackId trackId) {
        return tracks.stream()
            .filter(track -> Objects.equals(track.getMediaId(), trackId))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }
}
