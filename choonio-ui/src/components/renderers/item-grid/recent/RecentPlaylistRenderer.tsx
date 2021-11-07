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

import PlaylistCover from '../../../../components/covers/PlaylistCover'
import { ArtSize } from '../../../../api/model/art-model'
import { ItemGridRendererProps } from '../../../../components/item-grid/renderer/ItemGridRenderer'
import { ComponentType } from 'react'
import { RecentData } from '../../../../api/model/recents-model'
import { PlaylistIdentity } from '../../../../api/model/identity-model'

interface RecentPlaylistRendererProps {
    component: ComponentType<ItemGridRendererProps>
    item: RecentData
    onClick: () => void
    onClickPlay: () => void
    onClickMenu: (anchorEl: HTMLElement) => void
}

export default function RecentPlaylistRenderer({
    component: Component,
    item,
    onClick,
    onClickPlay,
    onClickMenu
}: RecentPlaylistRendererProps) {
    const playlist = item.mediaId as PlaylistIdentity
    return (
        <Component
            art={<PlaylistCover playlistName={playlist.playlistName} size={ArtSize.Medium} />}
            primary={playlist.playlistName}
            secondary={'Playlist'}
            onClick={onClick}
            onClickPlay={onClickPlay}
            onClickMenu={onClickMenu}
        />
    )
}
