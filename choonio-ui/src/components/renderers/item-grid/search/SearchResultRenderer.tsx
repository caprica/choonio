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

import { MediaType } from '../../../../api/model/identity-model'
import { SearchResultData } from '../../../../api/model/search-model'
import { useSearch } from '../../../../hooks/search/SearchContext'
import AlbumSearchResultRenderer from './AlbumSearchResultRenderer'
import ArtistSearchResultRenderer from './ArtistSearchResultRenderer'
import PlaylistSearchResultRenderer from './PlaylistSearchResultRenderer'
import TrackSearchResultRenderer from './TrackSearchResultRenderer'

interface SearchResultRendererProps {
    item: SearchResultData
    onClick: () => void
}

export default function SearchResultRenderer({ item, onClick }: SearchResultRendererProps) {
    const { searchResults } = useSearch()

    const highlight = searchResults?.query

    const mediaId = item.mediaId
    switch (mediaId.type) {
        case MediaType.Album:
            return <AlbumSearchResultRenderer mediaId={mediaId} highlight={highlight} onClick={onClick} />
        case MediaType.Artist:
            return <ArtistSearchResultRenderer mediaId={mediaId} highlight={highlight} onClick={onClick} />
        case MediaType.Track:
            return <TrackSearchResultRenderer mediaId={mediaId} highlight={highlight} onClick={onClick} />
        case MediaType.Playlist:
            return <PlaylistSearchResultRenderer mediaId={mediaId} highlight={highlight} onClick={onClick} />
    }
}
