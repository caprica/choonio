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

package uk.co.caprica.choonio.service.highlights.providers.dayofweek;

import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DaysOfWeekTest {

    @Test
    void whenGivenDateThenReturnCorrectDayOfWeek() {
        assertEquals(DayOfWeek.MONDAY, DaysOfWeek.getDayOfWeek(LocalDate.parse("2021-03-01")));
        assertEquals(DayOfWeek.TUESDAY, DaysOfWeek.getDayOfWeek(LocalDate.parse("2021-03-02")));
        assertEquals(DayOfWeek.WEDNESDAY, DaysOfWeek.getDayOfWeek(LocalDate.parse("2021-03-03")));
        assertEquals(DayOfWeek.THURSDAY, DaysOfWeek.getDayOfWeek(LocalDate.parse("2021-03-04")));
        assertEquals(DayOfWeek.FRIDAY, DaysOfWeek.getDayOfWeek(LocalDate.parse("2021-03-05")));
        assertEquals(DayOfWeek.SATURDAY, DaysOfWeek.getDayOfWeek(LocalDate.parse("2021-03-06")));
        assertEquals(DayOfWeek.SUNDAY, DaysOfWeek.getDayOfWeek(LocalDate.parse("2021-03-07")));
    }
}
