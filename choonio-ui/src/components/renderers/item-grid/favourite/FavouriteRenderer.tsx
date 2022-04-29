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

import { ComponentType } from 'react'
import { FavouriteData } from '../../../../api/model/favourites-model'
import { ItemGridRendererProps } from '../../../../components/item-grid/renderer/ItemGridRenderer'
import { MediaType } from '../../../../api/model/identity-model'
import { useFavouriteActions } from '../../../../hooks/actions/useFavouriteActions'
import { useFavouriteMenu } from '../../../../components/context/menus/favourite/FavouriteMenuContext'
import FavouriteAlbumRenderer from './FavouriteAlbumRenderer'
import FavouriteArtistRenderer from './FavouriteArtistRenderer'
import FavouritePlaylistRenderer from './FavouritePlaylistRenderer'
import FavouriteTrackRenderer from './FavouriteTrackRenderer'

/**
 * Properties for the component.
 */
interface FavouriteRendererProps {
    component: ComponentType<ItemGridRendererProps>
    item: FavouriteData
    onClick: () => void
}

/**
 * A component to render a particular type of favourite item.
 *
 * @param param0 destructured component properties
 */
export default function FavouriteRenderer({ component, item, onClick }: FavouriteRendererProps) {
    const { openFavouriteMenu } = useFavouriteMenu()

    const { playFavourite } = useFavouriteActions()

    const handleClickPlay = () => playFavourite(item.mediaId)

    const handleClickMenu = (anchorEl: HTMLElement) => openFavouriteMenu(item, anchorEl)

    const mediaId = item.mediaId
    switch (mediaId.type) {
        case MediaType.Artist:
            return (
                <FavouriteArtistRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
        case MediaType.Album:
            return (
                <FavouriteAlbumRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
        case MediaType.Track:
            return (
                <FavouriteTrackRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
        case MediaType.Playlist:
            return (
                <FavouritePlaylistRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
    }
}
