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
import { useQuery, useQueryClient } from 'react-query'
import { albumsUrl } from '../../config/service-endpoints'
import { AlbumData } from '../model/albums-model'

const QUERY_ID = 'albums'

const getAlbums = async (artistName: string): Promise<AlbumData[]> => {
    const { data } = await axios.get(albumsUrl(artistName))
    return data
}

const getAlbum = async (artistName: string, albumName: string): Promise<AlbumData> => {
    const { data } = await axios.get(albumsUrl(artistName, albumName))
    return data
}

export const useGetAlbums = (artistName: string) => {
    return useQuery<AlbumData[], Error>([QUERY_ID, artistName], () => getAlbums(artistName))
}

export const useGetAlbum = (artistName: string, albumName: string) => {
    return useQuery<AlbumData, Error>([QUERY_ID, artistName, albumName], () => getAlbum(artistName, albumName))
}

export const useInvalidateAlbums = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries(QUERY_ID)
}
