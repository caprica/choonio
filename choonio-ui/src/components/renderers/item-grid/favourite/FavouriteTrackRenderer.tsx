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
import { ArtSize } from '../../../../api/model/art-model'
import { FavouriteData } from '../../../../api/model/favourites-model'
import { ItemGridRendererProps } from '../../../../components/item-grid/renderer/ItemGridRenderer'
import { TrackIdentity, trackIdToArtistId } from '../../../../api/model/identity-model'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import AlbumCover from '../../../../components/covers/AlbumCover'

interface FavouriteTrackRendererProps {
    component: ComponentType<ItemGridRendererProps>
    item: FavouriteData
    onClick: () => void
    onClickPlay: () => void
    onClickMenu: (anchorEl: HTMLElement) => void
}

export default function FavouriteTrackRenderer({
    component: Component,
    item,
    onClick,
    onClickPlay,
    onClickMenu
}: FavouriteTrackRendererProps) {
    const { gotoArtist } = useNavigation()

    const trackId = item.mediaId as TrackIdentity

    const handleClickArtist = () => gotoArtist(trackIdToArtistId(trackId))

    return (
        <Component
            art={<AlbumCover artistName={trackId.albumArtistName} albumName={trackId.albumName} size={ArtSize.Medium} />}
            primary={trackId.trackName}
            secondary={`Track by ${trackId.albumArtistName}`}
            onClick={onClick}
            onClickSecondary={handleClickArtist}
            onClickPlay={onClickPlay}
            onClickMenu={onClickMenu}
        />
    )
}
