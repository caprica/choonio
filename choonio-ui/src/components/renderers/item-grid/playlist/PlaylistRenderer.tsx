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

import PlaylistCover from '../../../covers/PlaylistCover'
import { ArtSize } from '../../../../api/model/art-model'
import { ComponentType } from 'react'
import { ItemGridRendererProps } from '../../../item-grid/renderer/ItemGridRenderer'
import { usePlaylistMenu } from '../../../context/menus/playlist/PlaylistMenuContext'
import { usePlaylistActions } from '../../../../hooks/actions/usePlaylistActions'
import { PlaylistData } from '../../../../api/model/playlists-model'
import { formatDuration } from '../../../../lib/duration/duration'
import { pluralise } from '../../../../lib/pluralise/pluralise'

interface PlaylistRendererProps {
    component: ComponentType<ItemGridRendererProps>
    item: PlaylistData
    onClick: () => void
}

export default function PlaylistRenderer({ component: Component, item, onClick }: PlaylistRendererProps) {
    const { openPlaylistMenu } = usePlaylistMenu()

    const { playPlaylist } = usePlaylistActions()

    const handleClickPlay = () => playPlaylist(item.mediaId)

    const handleClickMenu = (anchorEl: HTMLElement) => openPlaylistMenu(item, anchorEl)

    const meta = `${pluralise('track', item.items.length)} • ${formatDuration(item.duration)}`

    return (
        <Component
            art={<PlaylistCover playlistName={item.mediaId.playlistName} size={ArtSize.Medium} />}
            primary={item.mediaId.playlistName}
            secondary={meta}
            onClick={onClick}
            onClickPlay={handleClickPlay}
            onClickMenu={handleClickMenu}
        />
    )
}
