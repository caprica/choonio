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
 *
 * Copyright 2021-2022 Caprica Software Limited
 */

/*
 * This file is part of Choonio.
 *
 * Choonio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Choonio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Choonio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2020 Caprica Software Limited.
 */

package uk.co.caprica.choonio.api.model.albums;

import lombok.Getter;

@Getter
public enum RatingValue {
    NEUTRAL(0),
    THUMBS_UP(1),
    THUMBS_DOWN(-1);

    private final int persistenceValue;

    RatingValue(int persistenceValue) {
        this.persistenceValue = persistenceValue;
    }

    public static RatingValue ratingValue(int value) {
        if (value > 0) {
            return RatingValue.THUMBS_UP;
        } else if (value < 0) {
            return RatingValue.THUMBS_DOWN;
        } else {
            return RatingValue.NEUTRAL;
        }
    }
}
