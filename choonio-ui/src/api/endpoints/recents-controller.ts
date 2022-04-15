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
import { recentPlaylistsUrl, recentsUrl } from '../../config/service-endpoints'
import { RecentData } from '../model/recents-model'

const QUERY_ID = 'recents'

const getRecents = async (): Promise<RecentData[]> => {
    const { data } = await axios.get(recentsUrl())
    return data
}

const deleteRecent = async (itemId: string) => {
    axios.delete(recentsUrl(itemId))
}

const getRecentPlaylists = async () => {
    const { data } = await axios.get(recentPlaylistsUrl())
    return data
}

export const useGetRecents = () => {
    return useQuery<RecentData[], Error>([QUERY_ID], () => getRecents())
}

export const useDeleteRecent = () => {
    const mutator = useMutation(deleteRecent)
    return (recentId: string) => mutator.mutate(recentId)
}

export const useGetRecentPlaylists = () => {
    return useQuery<RecentData[], Error>([QUERY_ID, 'playlists'], () => getRecentPlaylists())
}

export const useInvalidateRecents = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries([QUERY_ID])
}
