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

package uk.co.caprica.choonio.api.model.transfer;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DataTypeTest {

    @Test
    void itReturnsAllDataTypes() {
        DataType[] result = DataType.allDataTypes();
        assertNotNull(result);

        List<DataType> list = Arrays.asList(result);
        assertTrue(list.contains(DataType.FAVOURITES));
        assertTrue(list.contains(DataType.RECENTS));
        assertTrue(list.contains(DataType.PLAYLISTS));
        assertTrue(list.contains(DataType.PLAYS));
        assertTrue(list.contains(DataType.RATINGS));
        assertEquals(5, list.size());
    }
}
