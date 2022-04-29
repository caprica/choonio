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

import { ArtSize } from '../../../../api/model/art-model'
import { HighlightData } from '../../../../api/model/highlights-model'
import { AlbumIdentity } from '../../../../api/model/identity-model'
import { albumCoverUrl } from '../../../../config/service-endpoints'
import { useAlbumActions } from '../../../../hooks/actions/useAlbumActions'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import HighlightRenderer from '../../../highlights/HighlightRenderer'

interface AlbumHighlightRendererProps {
    highlight: HighlightData
}

export default function AlbumHighlightRenderer({ highlight }: AlbumHighlightRendererProps) {
    const { gotoAlbum } = useNavigation()

    const { playAlbum } = useAlbumActions()

    const albumId = highlight.mediaId as AlbumIdentity

    const handleClick = () => gotoAlbum(albumId)
    const handleClickPlay = () => playAlbum(albumId)

    return (
        <HighlightRenderer
            title='Recommended'
            artwork={`${albumCoverUrl(albumId.albumArtistName, albumId.albumName, ArtSize.Large)}`}
            rgb={highlight.rgb}
            primary={`${albumId.albumName}, album by ${albumId.albumArtistName}`}
            secondary={highlight.message}
            onClick={handleClick}
            onClickPlay={handleClickPlay}
        />
    )
}
