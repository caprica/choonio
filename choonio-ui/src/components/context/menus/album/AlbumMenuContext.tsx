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
import { AlbumData } from '../../../../api/model/albums-model'
import AlbumMenu from './AlbumMenu'

const AlbumMenuContext = createContext({} as AlbumMenuContextType)

interface AlbumMenuContextType {
    openAlbumMenu: (item: AlbumData, anchorEl: HTMLElement) => void
    closeAlbumMenu: () => void
}

export function AlbumMenuProvider({ children }: AlbumMenuProps) {
    const [item, setItem] = useState<AlbumData | undefined>(undefined)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined)
    const [open, setOpen] = useState(false)

    const openAlbumMenu = (item: AlbumData, anchorEl: HTMLElement) => {
        setItem(item)
        setAnchorEl(anchorEl)
        setOpen(true)
    }

    const closeAlbumMenu = () => setOpen(false)

    return (
        <AlbumMenuContext.Provider value={{ openAlbumMenu, closeAlbumMenu }}>
            {children}
            {anchorEl && item && <AlbumMenu anchorEl={anchorEl} item={item} open={open} />}
        </AlbumMenuContext.Provider>
    )
}

interface AlbumMenuProps {
    children: ReactNode
}

export const useAlbumMenu = () => useContext(AlbumMenuContext)
