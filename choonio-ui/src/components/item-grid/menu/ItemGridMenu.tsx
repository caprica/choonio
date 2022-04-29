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

import { Menu } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MouseEvent } from 'react'
import ItemGridMenuItem from './ItemGridMenuItem'
import MenuItemDivider from './MenuItemDivider'

/**
 * Specification for a menu item definition.
 */
export interface MenuItemDefinition {
    /**
     * Text to display for the menu item.
     */
    readonly caption: string
    /**
     * Function to invoke when the menu item is selected.
     */
    readonly handler: () => void
    /**
     * Flag to specify whether a menu item divider should be added after this menu item.
     */
    readonly divider?: boolean
}

/**
 * Component properties.
 *
 * @param T type of item in the item grid data model
 */
interface ItemGridMenuProps {
    /**
     * Collection of menu item definitions.
     */
    items: Array<MenuItemDefinition>
    /**
     * HTML element in the page used to anchor the menu popup.
     */
    anchorEl: HTMLElement | null

    open: boolean
    /**
     * Handler function to invoke to request the menu popup be closed.
     */
    onClose: () => void
}

/**
 * Custom styles for the component.
 */
const useStyles = makeStyles({
    menu: {
        padding: '16px 0'
    }
})

/**
 * Menu component for integration with the ItemGrid component.
 *
 * The menu component is not associated directly with the ItemGrid, rather it is integrated with an item renderer
 * component that is used by the ItemGrid.
 *
 * @param param0 destructured component properties
 */
export default function ItemGridMenu({ items, anchorEl, open, onClose }: ItemGridMenuProps) {
    const classes = useStyles()

    /**
     * Wrapper function to handle the close request from the underlying menu.
     *
     * The wrapper prevents the originating event from propagating to the underlying item in the grid and requests that
     * the menu be closed.
     *
     * @param event originating event
     */
    const handleClose = (event: MouseEvent<HTMLLIElement>) => {
        event.stopPropagation()
        onClose()
    }

    /**
     * Wrapper function for menu item selection event handlers.
     *
     * The wrapper prevents the originating event from propagating to the underlying item in the grid and requests that
     * the menu be closed before invoking the specific handler code for the selected action.
     *
     * @param menuItemDefinition menu item definition that was selected
     */
    const handleMenuAction = (menuItemDefinition: MenuItemDefinition) => (event: MouseEvent<HTMLLIElement>) => {
        event.stopPropagation()
        onClose()
        menuItemDefinition.handler()
    }

    const ignoreClick = (event: MouseEvent<HTMLElement>) => event.stopPropagation()

    const components: Array<JSX.Element> = []
    items.forEach(item => {
        components.push(<ItemGridMenuItem key={item.caption} caption={item.caption} onClick={handleMenuAction(item)} />)
        if (item.divider) components.push(<MenuItemDivider key={`_${item.caption}_`} />)
    })

    return (
        <Menu
            classes={{ list: classes.menu }}
            anchorEl={anchorEl}
            open={Boolean(open)}
            onClose={handleClose}
            keepMounted
            onClick={ignoreClick}
            BackdropProps={{ style: { opacity: 0 } }}
        >
            {components}
        </Menu>
    )
}
