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

package uk.co.caprica.choonio.service.highlights.providers.partofday;

import org.junit.jupiter.api.Test;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PartOfDayTest {

    @Test
    void whenGivenTimeThenReturnCorrectPartOfDay() {
        assertEquals(PartOfDay.MORNING, PartOfDay.getPartOfDay(LocalTime.parse("00:00:00")));
        assertEquals(PartOfDay.MORNING, PartOfDay.getPartOfDay(LocalTime.parse("06:59:59")));
        assertEquals(PartOfDay.MORNING, PartOfDay.getPartOfDay(LocalTime.parse("07:00:00")));
        assertEquals(PartOfDay.MORNING, PartOfDay.getPartOfDay(LocalTime.parse("07:00:01")));
        assertEquals(PartOfDay.MORNING, PartOfDay.getPartOfDay(LocalTime.parse("11:59:59")));
        assertEquals(PartOfDay.AFTERNOON, PartOfDay.getPartOfDay(LocalTime.parse("12:00:00")));
        assertEquals(PartOfDay.AFTERNOON, PartOfDay.getPartOfDay(LocalTime.parse("12:00:01")));
        assertEquals(PartOfDay.AFTERNOON, PartOfDay.getPartOfDay(LocalTime.parse("16:59:59")));
        assertEquals(PartOfDay.EVENING, PartOfDay.getPartOfDay(LocalTime.parse("17:00:00")));
        assertEquals(PartOfDay.EVENING, PartOfDay.getPartOfDay(LocalTime.parse("17:00:01")));
        assertEquals(PartOfDay.EVENING, PartOfDay.getPartOfDay(LocalTime.parse("23:59:59")));
    }
}
