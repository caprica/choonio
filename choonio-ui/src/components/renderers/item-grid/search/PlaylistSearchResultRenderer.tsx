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

import { usePlaylistActions } from '../../../../hooks/actions/usePlaylistActions'
import { ArtSize } from '../../../../api/model/art-model'
import { usePlaylistMenu } from '../../../context/menus/playlist/PlaylistMenuContext'
import PlaylistCover from '../../../covers/PlaylistCover'
import ItemGridRenderer from '../../../item-grid/renderer/ItemGridRenderer'
import { PlaylistIdentity } from '../../../../api/model/identity-model'

interface PlaylistSearchResultRendererProps {
    mediaId: PlaylistIdentity
    highlight?: string
    onClick: () => void
}

export default function PlaylistSearchResultRenderer({ mediaId, highlight, onClick }: PlaylistSearchResultRendererProps) {
    const { openPlaylistMenu } = usePlaylistMenu()

    const { playPlaylist } = usePlaylistActions()

    const handleClickPlay = () => playPlaylist(mediaId)

    const handleClickMenu = (_anchorEl: HTMLElement) => false
    // const handleClickItemMenu = (item: SearchResultData, anchorEl: HTMLElement) => openAlbumMenu(item, anchorEl)

    return (
        <ItemGridRenderer
            art={<PlaylistCover playlistName={mediaId.playlistName} size={ArtSize.Medium} />}
            primary={mediaId.playlistName}
            secondary='Playlist'
            highlight={highlight}
            onClick={onClick}
            onClickPlay={handleClickPlay}
            onClickMenu={handleClickMenu}
        />
    )
}
