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
import { AlbumIdentity, albumIdToArtistId } from '../../../../api/model/identity-model'
import { ArtSize } from '../../../../api/model/art-model'
import { FavouriteData } from '../../../../api/model/favourites-model'
import { ItemGridRendererProps } from '../../../item-grid/renderer/ItemGridRenderer'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import AlbumCover from '../../../covers/AlbumCover'

interface FavouriteAlbumRendererProps {
    component: ComponentType<ItemGridRendererProps>
    item: FavouriteData
    onClick: () => void
    onClickPlay: () => void
    onClickMenu: (anchorEl: HTMLElement) => void
}

export default function FavouriteAlbumRenderer({
    component: Component,
    item,
    onClick,
    onClickPlay,
    onClickMenu
}: FavouriteAlbumRendererProps) {
    const { gotoArtist } = useNavigation()

    const albumId = item.mediaId as AlbumIdentity

    const handleClickArtist = () => gotoArtist(albumIdToArtistId(albumId))

    return (
        <Component
            art={<AlbumCover artistName={albumId.albumArtistName} albumName={albumId.albumName} size={ArtSize.Medium} />}
            primary={albumId.albumName}
            secondary={albumId.albumArtistName}
            onClick={onClick}
            onClickSecondary={handleClickArtist}
            onClickPlay={onClickPlay}
            onClickMenu={onClickMenu}
        />
    )
}
