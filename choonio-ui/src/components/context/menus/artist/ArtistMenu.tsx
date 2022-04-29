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
import { useArtistMenu } from './ArtistMenuContext'
import { useArtistActions } from '../../../../hooks/actions/useArtistActions'
import { ArtistIdentity } from '../../../../api/model/identity-model'

interface ArtistMenuProps {
    item: ArtistIdentity
    anchorEl: HTMLElement | null
    open: boolean
}

export default function ArtistMenu({ item, anchorEl, open }: ArtistMenuProps) {
    const { closeArtistMenu } = useArtistMenu()
    const { addArtistToFavourites, addArtistToPlaylist, addArtistToQueue, playArtistNext, shuffleArtist } = useArtistActions()

    const handleShuffleArtist = () => shuffleArtist(item)
    const handlePlayArtistNext = () => playArtistNext(item)
    const handleAddArtistToQueue = () => addArtistToQueue(item)
    const handleAddArtistToPlaylist = () => addArtistToPlaylist(item)
    const handleAddArtistToFavourites = () => addArtistToFavourites(item)

    const handleClose = () => closeArtistMenu()

    const menuItems = [
        { caption: 'Shuffle', handler: handleShuffleArtist },
        { caption: 'Play artist next', handler: handlePlayArtistNext },
        { caption: 'Add artist to queue', handler: handleAddArtistToQueue, divider: true },
        { caption: 'Add artist to playlist', handler: handleAddArtistToPlaylist },
        { caption: 'Add artist to favourites', handler: handleAddArtistToFavourites }
    ]

    return <ItemGridMenu items={menuItems} anchorEl={anchorEl} open={open} onClose={handleClose} />
}
