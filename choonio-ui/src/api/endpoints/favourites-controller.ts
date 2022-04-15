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
import { favouritesUrl } from '../../config/service-endpoints'
import { FavouriteData } from '../model/favourites-model'
import { MediaIdentity } from '../model/identity-model'
import { AddToFavouritesRequest } from '../model/favourites-model'

const QUERY_ID = 'favourites'

const getFavourites = async () => {
    const { data } = await axios.get(favouritesUrl())
    return data
}

const putFavourites = async ({ mediaId }: AddToFavouritesRequest) => {
    const { data } = await axios.put(favouritesUrl(), { mediaId })
    return data
}

const deleteFavourite = async (favouriteId: string) => {
    axios.delete(favouritesUrl(favouriteId))
}

export const useGetFavourites = () => {
    return useQuery<FavouriteData[], Error>([QUERY_ID], () => getFavourites())
}

export const useAddToFavourites = () => {
    const mutator = useMutation(putFavourites)
    return (mediaId: MediaIdentity, onSuccess?: () => void) => mutator.mutate({ mediaId }, { onSuccess })
}

export const useDeleteFavourite = () => {
    const mutator = useMutation(deleteFavourite)
    return (favouriteId: string) => mutator.mutate(favouriteId)
}

export const useInvalidateFavourites = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries([QUERY_ID])
}
