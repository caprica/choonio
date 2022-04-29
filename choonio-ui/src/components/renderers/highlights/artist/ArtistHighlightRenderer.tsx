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
import { artistCoverUrl } from '../../../../config/service-endpoints'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import { ArtSize } from '../../../../api/model/art-model'
import HighlightRenderer from '../../../highlights/HighlightRenderer'
import { ArtistIdentity } from '../../../../api/model/identity-model'
import { useArtistActions } from '../../../../hooks/actions/useArtistActions'

interface ArtistHighlighterRendererProps {
    highlight: HighlightData
}

export default function ArtistHighlightRenderer({ highlight }: ArtistHighlighterRendererProps) {
    const { gotoArtist } = useNavigation()
    const { shuffleArtist } = useArtistActions()

    const artistId = highlight.mediaId as ArtistIdentity

    const handleClick = () => gotoArtist(artistId)
    const handleClickPlay = () => shuffleArtist(artistId)

    return (
        <HighlightRenderer
            title='Recommended'
            artwork={`${artistCoverUrl(artistId.artistName, ArtSize.Large)}`}
            rgb={highlight.rgb}
            primary={`${artistId.artistName}, artist`}
            secondary={highlight.message}
            onClick={handleClick}
            onClickPlay={handleClickPlay}
        />
    )
}
