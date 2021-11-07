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
import { queueUrl } from '../../config/service-endpoints'
import { PlaylistData } from '../model/playlists-model'
import { AddToQueueRequest } from '../model/queue-model'

const QUERY_ID = 'queue'

const getQueue = async (): Promise<PlaylistData> => {
    const { data } = await axios.get(queueUrl())
    return data
}

const putQueue = async (addToQueueRequest: AddToQueueRequest) => {
    const { data } = await axios.put(queueUrl(), addToQueueRequest)
    return data
}

const deleteQueue = async (itemId: string) => {
    axios.delete(queueUrl(itemId))
}

export const useGetQueue = () => {
    return useQuery<PlaylistData, Error>(QUERY_ID, () => getQueue())
}

export const useAddToQueue = () => {
    const mutator = useMutation(putQueue)
    return (addToQueueRequest: AddToQueueRequest, onSuccess: () => void) => mutator.mutate(addToQueueRequest, { onSuccess })
}

export const useRemoveFromQueue = () => {
    const mutator = useMutation(deleteQueue)
    return (itemId: string) => mutator.mutate(itemId)
}

export const useInvalidateQueue = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries(QUERY_ID)
}
