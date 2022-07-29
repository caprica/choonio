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
import { topAlbumsUrl, topArtistsUrl, topTracksUrl } from '../../config/service-endpoints'
import { DateRange } from '../../lib/date-ranges/date-ranges'
import { AlbumPlaysData, ArtistPlaysData, TrackPlaysData } from '../model/plays-model'

const TOP_ARTISTS_QUERY_ID = 'top-artists'
const TOP_ALBUMS_QUERY_ID = 'top-albums'
const TOP_TRACKS_QUERY_ID = 'top-tracks'

const getTopArtistPlays = async (top: number, range?: DateRange): Promise<ArtistPlaysData[]> => {
    const { data } = await axios.get(topArtistsUrl(top, range))
    return data
}

const getTopAlbumPlays = async (top: number, range?: DateRange): Promise<AlbumPlaysData[]> => {
    const { data } = await axios.get(topAlbumsUrl(top, range))
    return data
}

const getTopTrackPlays = async (top: number, range?: DateRange): Promise<TrackPlaysData[]> => {
    const { data } = await axios.get(topTracksUrl(top, range))
    return data
}

export const useGetTopArtistPlays = (top: number, range?: DateRange) => {
    return useQuery<ArtistPlaysData[], Error>([TOP_ARTISTS_QUERY_ID, top, range], () => getTopArtistPlays(top, range))
}

export const useGetTopAlbumPlays = (top: number, range?: DateRange) => {
    return useQuery<AlbumPlaysData[], Error>([TOP_ALBUMS_QUERY_ID, top, range], () => getTopAlbumPlays(top, range))
}

export const useGetTopTrackPlays = (top: number, range?: DateRange) => {
    return useQuery<TrackPlaysData[], Error>([TOP_TRACKS_QUERY_ID, top, range], () => getTopTrackPlays(top, range))
}

export const useInvalidateTopPlays = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries([TOP_ARTISTS_QUERY_ID])
    queryClient.invalidateQueries([TOP_ALBUMS_QUERY_ID])
    queryClient.invalidateQueries([TOP_TRACKS_QUERY_ID])
}
