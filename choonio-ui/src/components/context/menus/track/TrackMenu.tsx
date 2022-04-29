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

import ItemGridMenu from '../../../item-grid/menu/ItemGridMenu'
import { useTrackMenu } from './TrackMenuContext'
import { useTrackActions } from '../../../../hooks/actions/useTrackActions'
import { AlbumTrackData } from '../../../../api/model/albums-model'

interface TrackMenuProps {
    item: AlbumTrackData
    anchorEl: HTMLElement
    open: boolean
}

export default function TrackMenu({ item, anchorEl, open }: TrackMenuProps) {
    const { closeTrackMenu } = useTrackMenu()

    const { addTrackToFavourites, addTrackToPlaylist, addTrackToQueue, playTrackNext } = useTrackActions()

    const handlePlayNext = () => playTrackNext(item.mediaId)
    const handleAddToQueue = () => addTrackToQueue(item.mediaId)
    const handleAddToPlaylist = () => addTrackToPlaylist(item.mediaId)
    const handleAddToFavourites = () => addTrackToFavourites(item.mediaId)
    const handleClose = () => closeTrackMenu()

    const menuItems = [
        { caption: 'Play next', handler: handlePlayNext },
        { caption: 'Add to queue', handler: handleAddToQueue, divider: true },
        { caption: 'Add to playlist', handler: handleAddToPlaylist },
        { caption: 'Add to favourites', handler: handleAddToFavourites }
    ]

    return <ItemGridMenu items={menuItems} anchorEl={anchorEl} open={open} onClose={handleClose} />
}
