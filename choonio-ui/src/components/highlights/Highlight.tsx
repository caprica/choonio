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

import ArtistHighlightRenderer from '../renderers/highlights/artist/ArtistHighlightRenderer'
import AlbumHighlightRenderer from '../renderers/highlights/album/AlbumHighlightRenderer'
import PlaylistHighlightRenderer from '../renderers/highlights/playlist/PlaylistHighlightRenderer'
import { HighlightData } from '../../api/model/highlights-model'
import { MediaType } from '../../api/model/identity-model'

interface HighlightProps {
    highlight: HighlightData
}

export default function Highlight({ highlight }: HighlightProps) {
    switch (highlight.mediaId.type) {
        case MediaType.Artist:
            return <ArtistHighlightRenderer highlight={highlight} />
        case MediaType.Album:
            return <AlbumHighlightRenderer highlight={highlight} />
        case MediaType.Playlist:
            return <PlaylistHighlightRenderer highlight={highlight} />
        default:
            return null
    }
}
