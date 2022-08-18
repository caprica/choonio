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
import { equalizerPresetsUrl, equalizerAmpsUrl, equalizerUrl } from '../../config/service-endpoints'
import { EnableEqualizerRequest, EqualizerPresetData, EqualizerStateData, SetEqualizerRequest } from '../model/equalizer-model'

const STATE_QUERY_ID = 'equalizer-state'
const PRESETS_QUERY_ID = 'equalizer-presets'

const getEqualizerState = async () => {
    const { data } = await axios.get(equalizerUrl())
    return data
}

const putEqualizerEnable = async (enableEqualizerRequest: EnableEqualizerRequest) => {
    await axios.put(equalizerUrl(), enableEqualizerRequest)
}

const putEqualizerAmps = async (setEqualizerRequest: SetEqualizerRequest) => {
    await axios.put(equalizerAmpsUrl(), setEqualizerRequest)
}

const getEqualizerPresets = async () => {
    const { data } = await axios.get(equalizerPresetsUrl())
    return data
}

export const useGetEqualizerState = () => {
    return useQuery<EqualizerStateData, Error>([STATE_QUERY_ID], () => getEqualizerState())
}

export const useEnableEqualizer = () => {
    const mutator = useMutation(putEqualizerEnable)
    return (enable: boolean, onSuccess?: () => void) => mutator.mutate({ enable }, { onSuccess })
}

export const useSetEqualizer = () => {
    const mutator = useMutation(putEqualizerAmps)
    return (setEqualizerRequest: SetEqualizerRequest, onSuccess?: () => void) =>
        mutator.mutate(setEqualizerRequest, { onSuccess })
}

export const useGetEqualizerPresets = () => {
    return useQuery<EqualizerPresetData[], Error>([PRESETS_QUERY_ID], () => getEqualizerPresets())
}

export const useInvalidateEqualizerState = () => {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries([STATE_QUERY_ID])
}
