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

import createPersistedState from 'use-persisted-state'

export enum FavouritesGrouping {
    ByDate = 'by-date',
    ByName = 'by-name',
    ByType = 'by-type'
}

const captions = new Map()
captions.set(FavouritesGrouping.ByDate, 'by date')
captions.set(FavouritesGrouping.ByName, 'by name')
captions.set(FavouritesGrouping.ByType, 'by type')

export const captionForFavouritesGrouping = (value: string) => captions.get(value)

const DEFAULT_FAVOURITES_GROUP = FavouritesGrouping.ByDate

const useFavouritesGroupState = createPersistedState<FavouritesGrouping>('favouritesGroup')

export const useFavouritesSettings = () => {
    const [favouritesGroup, setFavouritesGroup] = useFavouritesGroupState(DEFAULT_FAVOURITES_GROUP)

    return {
        favouritesGroup,
        setFavouritesGroup: (group: FavouritesGrouping) => setFavouritesGroup(group)
    }
}
