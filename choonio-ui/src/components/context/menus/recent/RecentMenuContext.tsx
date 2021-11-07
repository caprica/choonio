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
import { RecentData } from '../../../../api/model/recents-model'
import RecentMenu from './RecentMenu'

const RecentMenuContext = createContext({} as RecentMenuContextType)

interface RecentMenuContextType {
    openRecentMenu: (item: RecentData, anchorEl: HTMLElement) => void
    closeRecentMenu: () => void
}

export function RecentMenuProvider({ children }: RecentMenuProps) {
    const [item, setItem] = useState<RecentData | undefined>(undefined)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined)
    const [open, setOpen] = useState(false)

    const openRecentMenu = (item: RecentData, anchorEl: HTMLElement) => {
        setItem(item)
        setAnchorEl(anchorEl)
        setOpen(true)
    }

    const closeRecentMenu = () => setOpen(false)

    return (
        <RecentMenuContext.Provider value={{ openRecentMenu, closeRecentMenu }}>
            {children}
            {anchorEl && item && <RecentMenu anchorEl={anchorEl} item={item} open={open} />}
        </RecentMenuContext.Provider>
    )
}

interface RecentMenuProps {
    children: ReactNode
}

export const useRecentMenu = () => useContext(RecentMenuContext)
