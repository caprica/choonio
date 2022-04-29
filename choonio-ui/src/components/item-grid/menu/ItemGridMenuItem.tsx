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

import { ForwardedRef, forwardRef, MouseEvent } from 'react'
import { MenuItem } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

/**
 * Component properties.
 *
 * @param T type of item in the item grid data model
 */
interface ItemGridMenuItemProps {
    /**
     * Text to display for the menu item.
     */
    caption: string
    /**
     * Function to invoke when the menu item is selected.
     */
    onClick: (event: MouseEvent<HTMLLIElement>) => void
}

/**
 * Custom styles for the component.
 */
const useStyles = makeStyles({
    menuItem: {
        fontSize: '15px',
        padding: '0 24px',
        height: '32px',
        lineHeight: '32px',
        margin: '0 !important',
        color: '#212121',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
})

function ItemGridMenuItem({ caption, onClick }: ItemGridMenuItemProps, ref: ForwardedRef<HTMLLIElement>) {
    const classes = useStyles()

    return (
        <MenuItem ref={ref} classes={{ dense: classes.menuItem }} dense onClick={onClick}>
            {caption}
        </MenuItem>
    )
}

/**
 * forwardRef is used so the Material UI menu component can pass a ref to this menu child component which is then subsequently
 * used to anchor and position the menu popup.
 *
 * Without this, the console will log an error stating functional components are unable to accept a ref.
 */
export default forwardRef<HTMLLIElement, ItemGridMenuItemProps>(ItemGridMenuItem)
