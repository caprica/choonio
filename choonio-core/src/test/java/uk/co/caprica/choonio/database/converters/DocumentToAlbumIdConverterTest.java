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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.MediaType;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class DocumentToAlbumIdConverterTest {

    private DocumentToAlbumIdConverter converter;

    @BeforeEach
    void beforeEach() {
        converter = new DocumentToAlbumIdConverter();
    }

    @Test
    void itConvertsDocumentToAlbumId() {
        Document document = new Document();
        document.put("type", MediaType.ALBUM.toString());
        document.put("albumArtistName", "STRNGR & Destryur");
        document.put("albumName", "Night At The Grindhouse");
        MediaId result = converter.convert(document);
        assertNotNull(result);
        AlbumId idResult = (AlbumId) result;
        assertEquals(MediaType.ALBUM, idResult.getType());
        assertEquals("STRNGR & Destryur", idResult.getAlbumArtistName());
        assertEquals("Night At The Grindhouse", idResult.getAlbumName());
    }
}
