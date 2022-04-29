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

import RadioIconImage from './radio-icon.png'

/**
 * Custom styles for the icon.
 */
const styles = {
    marginLeft: 8,
    width: 20,
    height: 20
}

/**
 * Simple image wrapper to render a radio tower icon.
 *
 * This icon is not available from the common sources, like 'react-icons'.
 */
export default function RadioIcon() {
    return <img src={RadioIconImage} alt='Radio icon' style={styles} />
}
