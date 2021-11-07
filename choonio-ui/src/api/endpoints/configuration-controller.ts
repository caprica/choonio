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
import { configurationUrl } from '../../config/service-endpoints'
import { ConfigurationData } from '../model/configuration-model'

const QUERY_ID = 'configuration'

const getConfiguration = async () => {
    const { data } = await axios.get(configurationUrl())
    return data
}

const putConfiguration = async (configuration: ConfigurationData) => {
    const { data } = await axios.put(configurationUrl(), configuration)
    return data
}

export const useGetConfiguration = () => {
    return useQuery<ConfigurationData, Error>(QUERY_ID, () => getConfiguration())
}

export const useSetConfiguration = () => {
    const mutator = useMutation(putConfiguration)
    return (configuration: ConfigurationData, onSuccess: () => void) => mutator.mutate(configuration, { onSuccess })
}

export const useInvalidateConfiguration = () => {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries(QUERY_ID)
}
