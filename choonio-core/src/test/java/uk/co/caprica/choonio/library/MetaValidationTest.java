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

package uk.co.caprica.choonio.library;

import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class MetaValidationTest {

    @Test
    void itDoesNotReturnNull() {
        AudioMeta audioMeta = new AudioMeta(
            "Various Artists",
            "Magnatron III",
            "Straplocked",
            "Dance/Electronic",
            2020,
            "Active Aggression",
            5,
            227,
            "/some/filename",
            Instant.parse("2021-09-30T12:34:56.777Z")
        );

        MetaValidation result = new MetaValidation(audioMeta);
        assertNotNull(result.getMeta());
        assertNotNull(result.getErrors());
    }

    @Test
    void itReturnsNoErrorsWhenValid() {
        AudioMeta audioMeta = new AudioMeta(
            "Various Artists",
            "Magnatron III",
            "Straplocked",
            "Dance/Electronic",
            2020,
            "Active Aggression",
            5,
            227,
            "/some/filename",
            Instant.parse("2021-09-30T12:34:56.777Z")
        );

        MetaValidation result = new MetaValidation(audioMeta);
        assertFalse(result.hasErrors());
        assertTrue(result.getErrors().isEmpty());
    }

    @Test
    void itReturnsErrorsForValidationFailures() {
        AudioMeta audioMeta = new AudioMeta(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            0,
            null,
            null
        );

        MetaValidation result = new MetaValidation(audioMeta);
        List<String> errors = result.getErrors();
        assertTrue(result.hasErrors());
        assertEquals("Album Artist Name is missing", errors.get(0));
        assertEquals("Album Name is missing", errors.get(1));
        assertEquals("Artist Name is missing", errors.get(2));
        assertEquals("Genre is missing", errors.get(3));
        assertEquals("Year is missing", errors.get(4));
        assertEquals("Track Name is missing", errors.get(5));
        assertEquals("Track Number is missing", errors.get(6));
        assertEquals(7, errors.size());
    }
}
