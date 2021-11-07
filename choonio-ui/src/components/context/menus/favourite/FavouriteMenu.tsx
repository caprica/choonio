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
import { useFavouriteMenu } from './FavouriteMenuContext'
import { useFavouriteActions } from '../../../../hooks/actions/useFavouriteActions'
import { FavouriteData } from '../../../../api/model/favourites-model'

/**
 * Component properties.
 */
interface FavouriteMenuProps {
    item: FavouriteData
    anchorEl: HTMLElement | null
    open: boolean
}

/**
 * Popup menu for the standard Album component.
 *
 * @param param0
 */
export default function FavouriteMenu({ item, anchorEl, open }: FavouriteMenuProps) {
    const { closeFavouriteMenu } = useFavouriteMenu()

    const { addFavouriteToPlaylist, addFavouriteToQueue, playFavouriteNext, shuffleFavourite, removeFavourite } =
        useFavouriteActions()

    const handleShuffle = () => shuffleFavourite(item.mediaId)
    const handleAddToQueue = () => addFavouriteToQueue(item.mediaId)
    const handlePlayNext = () => playFavouriteNext(item.mediaId)
    const handleAddToPlaylist = () => addFavouriteToPlaylist(item.mediaId)
    const handleRemove = () => removeFavourite(item.id)
    const handleClose = () => closeFavouriteMenu()

    const menuItems = [
        { caption: 'Shuffle', handler: handleShuffle },
        { caption: 'Play next', handler: handlePlayNext },
        { caption: 'Add to queue', handler: handleAddToQueue },
        { caption: 'Add to playlist', handler: handleAddToPlaylist, divider: true },
        { caption: 'Remove favourite', handler: handleRemove }
    ]

    return <ItemGridMenu items={menuItems} anchorEl={anchorEl} open={open} onClose={handleClose} />
}
