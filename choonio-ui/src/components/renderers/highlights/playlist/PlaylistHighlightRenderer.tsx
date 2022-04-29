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

import { HighlightData } from '../../../../api/model/highlights-model'
import { playlistCoverUrl } from '../../../../config/service-endpoints'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import { ArtSize } from '../../../../api/model/art-model'
import HighlightRenderer from '../../../highlights/HighlightRenderer'
import { PlaylistIdentity } from '../../../../api/model/identity-model'
import { usePlaylistActions } from '../../../../hooks/actions/usePlaylistActions'

interface PlaylistHighlightRendererProps {
    highlight: HighlightData
}

export default function PlaylistHighlightRenderer({ highlight }: PlaylistHighlightRendererProps) {
    const { gotoPlaylist } = useNavigation()
    const { playPlaylist } = usePlaylistActions()

    const playlistId = highlight.mediaId as PlaylistIdentity

    const handleClick = () => gotoPlaylist(playlistId)

    const handleClickPlay = () => playPlaylist(playlistId)

    return (
        <HighlightRenderer
            title='Recommended'
            artwork={`${playlistCoverUrl(playlistId.playlistName, ArtSize.Large)}`}
            rgb={highlight.rgb}
            primary={`${playlistId.playlistName}, playlist`}
            secondary={highlight.message}
            onClick={handleClick}
            onClickPlay={handleClickPlay}
        />
    )
}
