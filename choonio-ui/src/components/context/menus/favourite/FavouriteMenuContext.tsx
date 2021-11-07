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

import { ReactNode, useState, createContext, useContext } from 'react'
import { FavouriteData } from '../../../../api/model/favourites-model'
import FavouriteMenu from './FavouriteMenu'

const FavouriteMenuContext = createContext({} as FavouriteMenuContextType)

interface FavouriteMenuContextType {
    openFavouriteMenu: (item: FavouriteData, anchorEl: HTMLElement) => void
    closeFavouriteMenu: () => void
}

/**
 * A menu component used to ...
 *
 * This menu is factored out to a separate "global" component and shared so that a single instance may be re-used rather than
 * creating potentially hundreds of such instances (e.g. one per media item in a view).
 *
 * There are some intricacies here...
 *
 * The 'open' state is independent of the 'anchorEl' as we want to ensure correct behaviour of the open/close animated
 * transition.
 *
 *   - If there is no anchor id, then do not render the menu at all (impacts first time only).
 *   - If there is an anchor id, then it is kept regardless of the menu being open or not (to ensure a valid caption in the menu
 *     during the animation phase).
 *
 * @param param0 destructured component properties
 */
export function FavouriteMenuProvider({ children }: FavouriteMenuProps) {
    const [item, setItem] = useState<FavouriteData | undefined>(undefined)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined)
    const [open, setOpen] = useState(false)

    const openFavouriteMenu = (item: FavouriteData, anchorEl: HTMLElement) => {
        setItem(item)
        setAnchorEl(anchorEl)
        setOpen(true)
    }

    const closeFavouriteMenu = () => setOpen(false)

    return (
        <FavouriteMenuContext.Provider value={{ openFavouriteMenu, closeFavouriteMenu }}>
            {children}
            {anchorEl && item && <FavouriteMenu anchorEl={anchorEl} item={item} open={open} />}
        </FavouriteMenuContext.Provider>
    )
}

interface FavouriteMenuProps {
    children: ReactNode
}

export const useFavouriteMenu = () => useContext(FavouriteMenuContext)
