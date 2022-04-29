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

import lombok.Value;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Document("playlist")
@Value
public class Playlist {
    @Id String id;
    @Indexed(unique = true) PlaylistId mediaId;
    @With String description;
    @With List<PlaylistItem> items;
    @With int duration;
    Instant created;
    @With Instant updated;

    public static Playlist newPlaylist(PlaylistId mediaId, String description, Instant created) {
        return new Playlist(null, mediaId, description, new ArrayList<>(), 0, created, created);
    }

    public List<TrackId> trackIds() {
        return items.stream()
            .map(PlaylistItem::getMediaId)
            .collect(toList());
    }

    public List<AlbumId> albumIds() {
        return items.stream()
            .map(PlaylistItem::getMediaId)
            .map(TrackId::albumId)
            .collect(toList());
    }
}
