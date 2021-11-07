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

package uk.co.caprica.choonio.api.converters;

import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.art.ArtSize;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ArtSizeConverterTest {

    @Test
    void itConvertsFromStringsToArtSizes() {
        ArtSizeConverter converter = new ArtSizeConverter();
        assertEquals(ArtSize.LARGE, converter.convert("LARGE"));
        assertEquals(ArtSize.MEDIUM, converter.convert("MEDIUM"));
        assertEquals(ArtSize.SMALL, converter.convert("SMALL"));
        assertEquals(ArtSize.SMALLEST, converter.convert("SMALLEST"));
    }
}
