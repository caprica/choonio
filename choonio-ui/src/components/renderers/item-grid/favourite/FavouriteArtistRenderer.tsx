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

import { ComponentType } from 'react'
import { ArtistIdentity } from '../../../../api/model/identity-model'
import { ArtSize } from '../../../../api/model/art-model'
import { FavouriteData } from '../../../../api/model/favourites-model'
import { ItemGridRendererProps } from '../../../../components/item-grid/renderer/ItemGridRenderer'
import ArtistCover from '../../../../components/covers/ArtistCover'

interface FavouriteArtistRendererProps {
    component: ComponentType<ItemGridRendererProps>
    item: FavouriteData
    onClick: () => void
    onClickPlay: () => void
    onClickMenu: (anchorEl: HTMLElement) => void
}

export default function FavouriteArtistRenderer({
    component: Component,
    item,
    onClick,
    onClickPlay,
    onClickMenu
}: FavouriteArtistRendererProps) {
    const artistId = item.mediaId as ArtistIdentity

    return (
        <Component
            art={<ArtistCover artistName={artistId.artistName} size={ArtSize.Medium} />}
            primary={artistId.artistName}
            secondary={'Artist'}
            onClick={onClick}
            onClickPlay={onClickPlay}
            onClickMenu={onClickMenu}
        />
    )
}
