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
import { autoPlaylistsUrl, autoPlaylistsNamesUrl } from '../../config/service-endpoints'
import { PlaylistData, PlaylistName } from '../model/playlists-model'

const QUERY_ID = 'auto-playlists'

const getAutoPlaylistNames = async () => {
    const { data } = await axios.get(autoPlaylistsNamesUrl())
    return data
}

const getAutoPlaylists = async () => {
    const { data } = await axios.get(autoPlaylistsUrl())
    return data
}

const getAutoPlaylist = async (autoPlaylistId: string) => {
    const { data } = await axios.get(autoPlaylistsUrl(autoPlaylistId))
    return data
}

export const useGetAutoPlaylistNames = () => {
    return useQuery<PlaylistName[]>(['auto-playlist-names'], () => getAutoPlaylistNames())
}

export const useGetAutoPlaylists = () => {
    return useQuery<PlaylistData[], Error>([QUERY_ID], () => getAutoPlaylists())
}

export const useGetAutoPlaylist = (autoPlaylistId: string) => {
    return useQuery<PlaylistData, Error>([QUERY_ID, autoPlaylistId], () => getAutoPlaylist(autoPlaylistId))
}

export const useInvalidateAutoPlaylists = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries([QUERY_ID])
}
