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

import { CollectionName } from '../../api/model/event-model'

const collectionQueryCacheMap = new Map<CollectionName, Array<string>>()

collectionQueryCacheMap.set(CollectionName.Favourites, ['favourites'])
collectionQueryCacheMap.set(CollectionName.Highlights, ['highlights'])
collectionQueryCacheMap.set(CollectionName.Playlists, ['playlists', 'playlist-names', 'recent-playlists'])
collectionQueryCacheMap.set(CollectionName.Plays, [
    'albums',
    'playlists',
    'recents',
    'queue',
    'top-albums',
    'top-artists',
    'top-tracks'
])
collectionQueryCacheMap.set(CollectionName.Queue, ['queue'])
collectionQueryCacheMap.set(CollectionName.Ratings, ['albums', 'playlists', 'queue'])
collectionQueryCacheMap.set(CollectionName.Recents, ['recents', 'queue'])
collectionQueryCacheMap.set(CollectionName.Configuration, ['configuration'])

export { collectionQueryCacheMap }
