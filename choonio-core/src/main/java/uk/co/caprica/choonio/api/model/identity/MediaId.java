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

package uk.co.caprica.choonio.api.model.identity;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * An identifier for a type of media.
 * <p>
 * The "type" property is used as a subtype discriminator when marshalling/unmarshalling JSON.
 * <p>
 * That same "type" property is persisted to the database when persisting the identity subtype, but it is NOT set back
 * on the object when reading from the database.
 * <p>
 * This approach is desirable, but requires the provision of various custom database converter components.
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "type"
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = ArtistId.class, name = "ARTIST"),
    @JsonSubTypes.Type(value = AlbumId.class, name = "ALBUM"),
    @JsonSubTypes.Type(value = TrackId.class, name = "TRACK"),
    @JsonSubTypes.Type(value = PlaylistId.class, name = "PLAYLIST"),
})
public interface MediaId {
    MediaType getType();
    String name();
}
