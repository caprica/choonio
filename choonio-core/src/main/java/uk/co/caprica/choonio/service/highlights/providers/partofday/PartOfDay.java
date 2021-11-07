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

import java.time.LocalTime;

public enum PartOfDay {
    MORNING,
    AFTERNOON,
    EVENING;

    public static final int AFTERNOON_HOUR = 12;
    public static final int EVENING_HOUR = 17;

    public static PartOfDay getPartOfDay(LocalTime time) {
        LocalTime afternoonStarts = LocalTime.of(AFTERNOON_HOUR, 0);
        LocalTime eveningStarts = LocalTime.of(EVENING_HOUR, 0);
        if (time.isBefore(afternoonStarts)) {
            return PartOfDay.MORNING;
        } else if (time.isBefore(eveningStarts)) {
            return PartOfDay.AFTERNOON;
        } else {
            return PartOfDay.EVENING;
        }
    }
}
