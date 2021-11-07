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

import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.identity.ArtistId;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class HighlightTest {

    @Test
    void itCreatesHighlight() {
        Highlight result = Highlight.newHighlight(
            "Test",
            "NINA is a favourite artist",
            new ArtistId("NINA"),
            new int[] { 10, 20, 30 },
            Instant.parse("2021-09-28T18:54:07.222Z")
        );
        assertNotNull(result);
        assertNull(result.getId());
        assertEquals("Test", result.getType());
        assertEquals("NINA is a favourite artist", result.getMessage());
        assertEquals(new ArtistId("NINA"), result.getMediaId());
        assertArrayEquals(new int[]{10, 20, 30}, result.getRgb());
        assertEquals(Instant.parse("2021-09-28T18:54:07.222Z"), result.getTimestamp());
    }
}
