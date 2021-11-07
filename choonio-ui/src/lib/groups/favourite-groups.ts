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

import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { FavouriteData } from '../../api/model/favourites-model'
import { captionForMediaId, MediaType } from '../../api/model/identity-model'
import { FavouritesGrouping } from '../../hooks/settings/useFavouritesSettings'

export type FavouriteGrouping = {
    id: string
    name?: string
    favourites: Array<FavouriteData>
}

export const getFavouriteGroups = (favourites: Array<FavouriteData>, grouping: FavouritesGrouping): Array<FavouriteGrouping> => {
    switch (grouping) {
        case FavouritesGrouping.ByDate:
            return getFavouritesByDate(favourites)
        case FavouritesGrouping.ByName:
            return getFavouritesByName(favourites)
        case FavouritesGrouping.ByType:
            return getFavouritesByType(favourites)
    }
}

const getFavouritesByDate = (favourites: Array<FavouriteData>) => [{ id: 'date', favourites }]

const getFavouritesByName = (favourites: Array<FavouriteData>) => [{ id: 'name', favourites: sortBy(favourites, sortByMediaId) }]

const sortByMediaId = (recent: FavouriteData) => captionForMediaId(recent.mediaId)

const getFavouritesByType = (favourites: Array<FavouriteData>) => {
    const grouped = groupBy(favourites, (favourite: FavouriteData) => favourite.mediaId.type)
    return [
        { id: 'artists', name: 'Artists', favourites: grouped[MediaType.Artist] },
        { id: 'albums', name: 'Albums', favourites: grouped[MediaType.Album] },
        { id: 'tracks', name: 'Tracks', favourites: grouped[MediaType.Track] },
        { id: 'playlists', name: 'Playlists', favourites: grouped[MediaType.Playlist] }
    ]
}
