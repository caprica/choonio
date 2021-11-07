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
import { ArtistIdentity } from '../../../../api/model/identity-model'
import ArtistMenu from './ArtistMenu'

const ArtistMenuContext = createContext({} as ArtistMenuContextType)

interface ArtistMenuContextType {
    openArtistMenu: (item: ArtistIdentity, anchorEl: HTMLElement) => void
    closeArtistMenu: () => void
}

export function ArtistMenuProvider({ children }: ArtistMenuProps) {
    const [item, setItem] = useState<ArtistIdentity | undefined>(undefined)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined)
    const [open, setOpen] = useState(false)

    const openArtistMenu = (item: ArtistIdentity, anchorEl: HTMLElement) => {
        setItem(item)
        setAnchorEl(anchorEl)
        setOpen(true)
    }

    const closeArtistMenu = () => setOpen(false)

    return (
        <ArtistMenuContext.Provider value={{ openArtistMenu, closeArtistMenu }}>
            {children}
            {anchorEl && item && <ArtistMenu anchorEl={anchorEl} item={item} open={open} />}
        </ArtistMenuContext.Provider>
    )
}

interface ArtistMenuProps {
    children: ReactNode
}

export const useArtistMenu = () => useContext(ArtistMenuContext)
