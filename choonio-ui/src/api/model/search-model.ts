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

import { MediaIdentity } from './identity-model'

export interface CombinedSearchResultsData {
    readonly query: string
    readonly limit: number
    readonly hits: number
    readonly artists: SearchResultsData
    readonly albums: SearchResultsData
    readonly tracks: SearchResultsData
    readonly playlists: SearchResultsData
}

export interface SearchResultsData {
    readonly hits: number
    readonly results: Array<SearchResultData>
}

export interface SearchResultData {
    readonly mediaId: MediaIdentity
    readonly score: number
}
