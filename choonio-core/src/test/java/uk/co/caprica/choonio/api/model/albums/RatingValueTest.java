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

package uk.co.caprica.choonio.api.model.albums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RatingValueTest {

    @Test
    void itReturnsPersistenceValue() {
        assertEquals(1, RatingValue.THUMBS_UP.getPersistenceValue());
        assertEquals(0, RatingValue.NEUTRAL.getPersistenceValue());
        assertEquals(-1, RatingValue.THUMBS_DOWN.getPersistenceValue());
    }

    @Test
    void itReturnsRatingValueForPersistenceValue() {
        assertEquals(RatingValue.THUMBS_UP, RatingValue.ratingValue(1));
        assertEquals(RatingValue.NEUTRAL, RatingValue.ratingValue(0));
        assertEquals(RatingValue.THUMBS_DOWN, RatingValue.ratingValue(-1));
    }
}
