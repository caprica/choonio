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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listensByArtistUrl } from '../../config/service-endpoints'
import { ArtistListenStatsResult } from '../model/statistics-model'

const LISTENS_BY_ARTIST_QUERY_ID = 'listens-by-artist'

const getListensByArtist = async (
    minimumListens: number,
    fromDateInclusive?: string,
    toDateExclusive?: string
): Promise<ArtistListenStatsResult> => {
    const { data } = await axios.get(listensByArtistUrl(minimumListens, fromDateInclusive, toDateExclusive))
    return data
}

export const useGetListensByArtist = (minimumListens: number, fromDateInclusive?: string, toDateExclusive?: string) => {
    return useQuery<ArtistListenStatsResult, Error>(
        [LISTENS_BY_ARTIST_QUERY_ID, minimumListens, fromDateInclusive, toDateExclusive],
        () => getListensByArtist(minimumListens, fromDateInclusive, toDateExclusive)
    )
}

export const useListensByArtist = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries([LISTENS_BY_ARTIST_QUERY_ID])
}
