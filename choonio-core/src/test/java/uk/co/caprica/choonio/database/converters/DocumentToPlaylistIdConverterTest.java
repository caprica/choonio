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

package uk.co.caprica.choonio.database.converters;

import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class DocumentToPlaylistIdConverterTest {

    private DocumentToPlaylistIdConverter converter;

    @BeforeEach
    void beforeEach() {
        converter = new DocumentToPlaylistIdConverter();
    }

    @Test
    void itConvertsDocumentToPlaylistId() {
        Document document = new Document();
        document.put("type", MediaType.PLAYLIST.toString());
        document.put("playlistName", "All Destryur");
        PlaylistId result = converter.convert(document);
        assertNotNull(result);
        assertEquals(MediaType.PLAYLIST, result.getType());
        assertEquals("All Destryur", result.getPlaylistName());
    }
}