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
import { usePlaylistMenu } from './PlaylistMenuContext'
import { usePlaylistActions } from '../../../../hooks/actions/usePlaylistActions'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import { PlaylistData } from '../../../../api/model/playlists-model'

interface PlaylistMenuProps {
    item: PlaylistData
    anchorEl: HTMLElement | null
    open: boolean
}

export default function PlaylistMenu({ item, anchorEl, open }: PlaylistMenuProps) {
    const { closePlaylistMenu } = usePlaylistMenu()

    const { addPlaylistToFavourites, addPlaylistToQueue, playPlaylistNext, removePlaylist, shufflePlaylist } =
        usePlaylistActions()

    const { gotoPlaylistEdit } = useNavigation()

    const handleShuffle = () => shufflePlaylist(item.mediaId)
    const handlePlayNext = () => playPlaylistNext(item.mediaId)
    const handleAddToQueue = () => addPlaylistToQueue(item.mediaId)
    const handleAddToFavourites = () => addPlaylistToFavourites(item.mediaId)
    const handleEdit = () => gotoPlaylistEdit(item.mediaId)
    const handleRename = () => false
    const handleDelete = () => removePlaylist(item.mediaId)
    const handleClose = () => closePlaylistMenu()

    const menuItems = [
        { caption: 'Shuffle', handler: handleShuffle },
        { caption: 'Play next', handler: handlePlayNext },
        { caption: 'Add to queue', handler: handleAddToQueue },
        { caption: 'Add to favourites', handler: handleAddToFavourites, divider: true },
        { caption: 'Edit playlist', handler: handleEdit },
        { caption: 'Rename playlist', handler: handleRename, divider: true },
        { caption: 'Delete playlist', handler: handleDelete }
    ]

    return (
        <>
            <ItemGridMenu items={menuItems} anchorEl={anchorEl} open={open} onClose={handleClose} />
            {/* <ConfirmDeletePlaylistDialog
                playlist={item}
                open={confirmDeletePlaylistDialog}
                onClose={handleCloseConfirmDeletePlaylistDialog}
                onConfirm={handleConfirmDeletePlaylist}
            /> */}
        </>
    )
}
