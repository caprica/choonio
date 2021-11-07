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

import { MouseEvent } from 'react'

/**
 * Event handler that prevents mouse clicks from propagating to any underlying component that would otherwise be
 * inadvertently activated.
 *
 * Without this, a click for example on the dialog backdrop component would propagate to a component underneath the
 * dialog and activate it.
 *
 * @param event mouse event
 */
export const ignoreClicks = (event: MouseEvent<HTMLElement>) => event.stopPropagation()
