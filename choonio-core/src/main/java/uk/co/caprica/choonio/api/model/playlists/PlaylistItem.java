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

package uk.co.caprica.choonio.api.model.playlists;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Value;
import lombok.With;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.Indexed;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.TrackId;

/**
 * A playlist item represents a track within a playlist.
 * <p>
 * We can <strong>not</strong> however just store the track id, as the same track may appear at multiple positions in
 * the same playlist.
 * <p>
 * For this reason, each playlist item is assigned a new unique identifier - this is similar to a database unique
 * identifier, but is not used for that purpose.
 */
@Value
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlaylistItem {
    @Indexed String id;
    TrackId mediaId;

    @With transient AlbumTrack track;

    public static PlaylistItem newPlaylistItem(TrackId mediaId) {
        return new PlaylistItem(new ObjectId().toHexString(), mediaId, null);
    }
}
