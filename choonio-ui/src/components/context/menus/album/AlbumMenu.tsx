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

import { AlbumData } from '../../../../api/model/albums-model'
import ItemGridMenu from '../../../item-grid/menu/ItemGridMenu'
import { useAlbumMenu } from './AlbumMenuContext'
import { useAlbumActions } from '../../../../hooks/actions/useAlbumActions'

interface AlbumMenuProps {
    item: AlbumData
    anchorEl: HTMLElement | null
    open: boolean
}

export default function AlbumMenu({ item, anchorEl, open }: AlbumMenuProps) {
    const { closeAlbumMenu } = useAlbumMenu()

    const { addAlbumToFavourites, addAlbumToPlaylist, addAlbumToQueue, playAlbumNext, shuffleAlbum } = useAlbumActions()

    const handleShuffleAlbum = () => shuffleAlbum(item.mediaId)
    const handlePlayAlbumNext = () => playAlbumNext(item.mediaId)
    const handleAddAlbumToQueue = () => addAlbumToQueue(item.mediaId)
    const handleAddAlbumToPlaylist = () => addAlbumToPlaylist(item.mediaId)
    const handleAddAlbumToFavourites = () => addAlbumToFavourites(item.mediaId)
    const handleClose = () => closeAlbumMenu()

    const menuItems = [
        { caption: 'Shuffle', handler: handleShuffleAlbum },
        { caption: 'Play album next', handler: handlePlayAlbumNext },
        { caption: 'Add album to queue', handler: handleAddAlbumToQueue, divider: true },
        { caption: 'Add album to playlist', handler: handleAddAlbumToPlaylist },
        { caption: 'Add album to favourites', handler: handleAddAlbumToFavourites }
    ]

    return <ItemGridMenu items={menuItems} anchorEl={anchorEl} open={open} onClose={handleClose} />
}
