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

import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { highlightsUrl } from '../../config/service-endpoints'
import { HighlightData } from '../model/highlights-model'

const QUERY_ID = 'highlights'

const getHighlights = async (): Promise<HighlightData[]> => {
    const { data } = await axios.get(highlightsUrl())
    return data
}

const refreshHighlights = async () => {
    await axios.post(highlightsUrl())
}

export const useGetHighlights = () => {
    return useQuery<HighlightData[], Error>([QUERY_ID], () => getHighlights())
}

export const useRefreshHighlights = () => {
    const mutator = useMutation(refreshHighlights)
    return () => mutator.mutate()
}

export const useInvalidateHighlights = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries([QUERY_ID])
}
