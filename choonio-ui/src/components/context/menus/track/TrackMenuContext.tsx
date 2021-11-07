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
import { AlbumTrackData } from '../../../../api/model/albums-model'
import TrackMenu from './TrackMenu'

const TrackMenuContext = createContext({} as TrackMenuContextType)

interface TrackMenuContextType {
    openTrackMenu: (item: AlbumTrackData, anchorEl: HTMLElement) => void
    closeTrackMenu: () => void
}

export function TrackMenuProvider({ children }: TrackMenuProps) {
    const [item, setItem] = useState<AlbumTrackData | undefined>(undefined)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined)
    const [open, setOpen] = useState(false)

    const openTrackMenu = (item: AlbumTrackData, anchorEl: HTMLElement) => {
        setItem(item)
        setAnchorEl(anchorEl)
        setOpen(true)
    }

    const closeTrackMenu = () => setOpen(false)

    return (
        <TrackMenuContext.Provider value={{ openTrackMenu, closeTrackMenu }}>
            {children}
            {anchorEl && item && <TrackMenu anchorEl={anchorEl} item={item} open={open} />}
        </TrackMenuContext.Provider>
    )
}

interface TrackMenuProps {
    children: ReactNode
}

export const useTrackMenu = () => useContext(TrackMenuContext)
