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

import { useTrackActions } from '../../../../hooks/actions/useTrackActions'
import { ArtSize } from '../../../../api/model/art-model'
import AlbumCover from '../../../covers/AlbumCover'
import ItemGridRenderer from '../../../item-grid/renderer/ItemGridRenderer'
import { TrackIdentity } from '../../../../api/model/identity-model'

interface TrackSearchResultRendererProps {
    mediaId: TrackIdentity
    highlight?: string
    onClick: () => void
}

export default function TrackSearchResultRenderer({ mediaId, highlight, onClick }: TrackSearchResultRendererProps) {
    // const { openTrackMenu } = useTrackMenu()

    const { playTrack } = useTrackActions()

    const handleClickPlay = () => playTrack(mediaId)

    // const handleClickMenu = (anchorEl: HTMLElement) => openTrackMenu(item, anchorEl)

    return (
        <ItemGridRenderer
            art={<AlbumCover artistName={mediaId.albumArtistName} albumName={mediaId.albumName} size={ArtSize.Medium} />}
            primary={mediaId.trackName}
            secondary={`by ${mediaId.albumArtistName}`}
            highlight={highlight}
            onClick={onClick}
            onClickPlay={handleClickPlay}
            // onClickMenu={handleClickMenu}
        />
    )
}
