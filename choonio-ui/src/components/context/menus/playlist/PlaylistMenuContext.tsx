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
import { PlaylistData } from '../../../../api/model/playlists-model'
import PlaylistMenu from './PlaylistMenu'

const PlaylistMenuContext = createContext({} as PlaylistMenuContextType)

interface PlaylistMenuContextType {
    openPlaylistMenu: (item: PlaylistData, anchorEl: HTMLElement) => void
    closePlaylistMenu: () => void
}

export function PlaylistMenuProvider({ children }: PlaylistMenuProps) {
    const [item, setItem] = useState<PlaylistData | undefined>(undefined)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined)
    const [open, setOpen] = useState(false)

    const openPlaylistMenu = (item: PlaylistData, anchorEl: HTMLElement) => {
        setItem(item)
        setAnchorEl(anchorEl)
        setOpen(true)
    }

    const closePlaylistMenu = () => setOpen(false)

    return (
        <PlaylistMenuContext.Provider value={{ openPlaylistMenu, closePlaylistMenu }}>
            {children}
            {anchorEl && item && <PlaylistMenu anchorEl={anchorEl} item={item} open={open} />}
        </PlaylistMenuContext.Provider>
    )
}

interface PlaylistMenuProps {
    children: ReactNode
}

export const usePlaylistMenu = () => useContext(PlaylistMenuContext)
