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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { playlistsUrl, playlistsNamesUrl } from '../../config/service-endpoints'
import { MediaIdentity } from '../model/identity-model'
import { AddToPlaylistRequest, PlaylistData, PlaylistName } from '../model/playlists-model'
import { UpdatePlaylistRequestData } from '../model/playlists-model'

const QUERY_ID = 'playlists'

const getPlaylistNames = async () => {
    const { data } = await axios.get(playlistsNamesUrl())
    return data
}

const getPlaylists = async () => {
    const { data } = await axios.get(playlistsUrl())
    return data
}

const getPlaylist = async (playlistId: string) => {
    const { data } = await axios.get(playlistsUrl(playlistId))
    return data
}

const addMediaToPlaylist = async ({
    playlistId,
    addToPlaylistRequest
}: {
    playlistId: string
    addToPlaylistRequest: AddToPlaylistRequest
}) => {
    await axios.post(playlistsUrl(playlistId), addToPlaylistRequest)
}

const putPlaylist = async ({ playlistId, playlist }: { playlistId: string; playlist: UpdatePlaylistRequestData }) => {
    await axios.put(playlistsUrl(playlistId), playlist)
}

const deletePlaylists = async (playlistId: string) => {
    axios.delete(playlistsUrl(playlistId))
}

const deletePlaylist = async ({ playlistId, itemId }: { playlistId: string; itemId: string }) => {
    axios.delete(playlistsUrl(playlistId, itemId))
}

export const useGetPlaylistNames = () => {
    return useQuery<PlaylistName[]>(['playlist-names'], () => getPlaylistNames())
}

export const useGetPlaylists = () => {
    return useQuery<PlaylistData[], Error>([QUERY_ID], () => getPlaylists())
}

export const useGetPlaylist = (playlistId: string) => {
    return useQuery<PlaylistData, Error>([QUERY_ID, playlistId], () => getPlaylist(playlistId))
}

export const useAddMediaToPlaylist = () => {
    const mutator = useMutation(addMediaToPlaylist)
    return (playlistId: string, mediaId: MediaIdentity, onSuccess?: () => void) => {
        const addToPlaylistRequest: AddToPlaylistRequest = { mediaId }
        mutator.mutate({ playlistId, addToPlaylistRequest }, { onSuccess })
    }
}

export const useSavePlaylist = () => {
    const mutator = useMutation(putPlaylist)
    return (playlistId: string, playlist: UpdatePlaylistRequestData, onSuccess?: () => void) =>
        mutator.mutate({ playlistId, playlist }, { onSuccess })
}

export const useDeletePlaylist = () => {
    const mutator = useMutation(deletePlaylists)
    return (playlistId: string, onSuccess?: () => void) => mutator.mutate(playlistId, { onSuccess })
}

export const useRemoveFromPlaylist = () => {
    const mutator = useMutation(deletePlaylist)
    return (playlistId: string, itemId: string, onSuccess?: () => void) => mutator.mutate({ playlistId, itemId }, { onSuccess })
}

export const useInvalidatePlaylists = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries([QUERY_ID])
}
