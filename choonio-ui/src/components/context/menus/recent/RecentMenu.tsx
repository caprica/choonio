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

import ItemGridMenu from '../../../item-grid/menu/ItemGridMenu'
import { useRecentMenu } from './RecentMenuContext'
import { useRecentActions } from '../../../../hooks/actions/useRecentActions'
import { RecentData } from '../../../../api/model/recents-model'

interface RecentMenuProps {
    item: RecentData
    anchorEl: HTMLElement | null
    open: boolean
}

export default function RecentMenu({ item, anchorEl, open }: RecentMenuProps) {
    const { closeRecentMenu } = useRecentMenu()

    const { addRecentToFavourites, addRecentToPlaylist, addRecentToQueue, playRecentNext, removeRecent, shuffleRecent } =
        useRecentActions()

    const handleShuffle = () => shuffleRecent(item.mediaId)
    const handlePlayNext = () => playRecentNext(item.mediaId)
    const handleAddToQueue = () => addRecentToQueue(item.mediaId)
    const handleAddToPlaylist = () => addRecentToPlaylist(item.mediaId)
    const handleAddToFavourites = () => addRecentToFavourites(item.mediaId)
    const handleDismiss = () => removeRecent(item.id)
    const handleClose = () => closeRecentMenu()

    const menuItems = [
        { caption: 'Shuffle', handler: handleShuffle },
        { caption: 'Play next', handler: handlePlayNext },
        { caption: 'Add to queue', handler: handleAddToQueue, divider: true },
        { caption: 'Add to playlist', handler: handleAddToPlaylist },
        { caption: 'Add to favourites', handler: handleAddToFavourites, divider: true },
        { caption: 'Dismiss', handler: handleDismiss }
    ]

    return <ItemGridMenu items={menuItems} anchorEl={anchorEl} open={open} onClose={handleClose} />
}
