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

package uk.co.caprica.choonio.service.clock;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class ClockService implements Clock.Service {

    @Override
    public Instant instant() {
        return Instant.now();
    }

    @Override
    public LocalDate localDate() {
        return LocalDate.now();
    }

    @Override
    public LocalTime localTime() {
        return LocalTime.now();
    }

    @Override
    public LocalDateTime localDateTime() {
        return LocalDateTime.now();
    }

    @Override
    public long millis() {
        return System.currentTimeMillis();
    }
}
