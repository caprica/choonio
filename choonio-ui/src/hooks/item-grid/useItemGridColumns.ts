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

import useMediaQuery from '@mui/material/useMediaQuery'

export const useItemGridColumns = () => {
    const size8 = useMediaQuery(`(min-width:1920px)`)
    const size7 = useMediaQuery(`(min-width:1720px)`)
    const size6 = useMediaQuery(`(min-width:1520px)`)
    const size5 = useMediaQuery(`(min-width:1320px)`)

    if (size8) return 8
    if (size7) return 7
    if (size6) return 6
    if (size5) return 5
    return 4
}
