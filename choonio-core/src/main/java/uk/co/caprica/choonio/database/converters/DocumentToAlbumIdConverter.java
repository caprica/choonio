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

package uk.co.caprica.choonio.database.converters;

import org.bson.Document;
import org.springframework.data.convert.ReadingConverter;
import uk.co.caprica.choonio.api.model.identity.AlbumId;

@ReadingConverter
public class DocumentToAlbumIdConverter extends BaseDocumentConverter<AlbumId> {
    @Override
    public AlbumId convert(Document document) {
        return new AlbumId(
            string("albumArtistName", document),
            string("albumName", document)
        );
    }
}
