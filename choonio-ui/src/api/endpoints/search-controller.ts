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

import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { quickSearchUrl } from '../../config/service-endpoints'
import { CombinedSearchResultsData } from '../model/search-model'

const SEARCH_QUERY_ID = 'search-results'

const getQuickSearchResults = async (query: string): Promise<CombinedSearchResultsData> => {
    const { data } = await axios.get(quickSearchUrl(query))
    return data
}

export const useGetQuickSearchResults = (query: string) => {
    return useQuery<CombinedSearchResultsData, Error>([SEARCH_QUERY_ID], () => getQuickSearchResults(query))
}
