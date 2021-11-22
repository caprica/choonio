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

import { createContext, ReactNode, useContext } from 'react'
import { useGetListensByArtist } from '../../../../../api/endpoints/statistics-controller'
import { ArtistPlaysData } from '../../../../../api/model/plays-model'
import { ListensMeta } from '../../../../../api/model/statistics-model'
import { useVisualisationOptions } from '../options/visualisation-options-context'

interface VisualisationDataContextProps {
    meta?: ListensMeta
    listens?: Array<ArtistPlaysData>
}

interface VisualisationDataContextProviderProps {
    children?: ReactNode
}

export const VisualisationDataContext = createContext<VisualisationDataContextProps | undefined>(undefined)

export const VisualisationDataContextProvider = ({ children }: VisualisationDataContextProviderProps) => {
    const { options } = useVisualisationOptions()

    const { data: listens } = useGetListensByArtist(options.minimumCount, options.from, options.to)

    return (
        <VisualisationDataContext.Provider value={{ meta: listens?.meta, listens: listens?.data }}>
            {children}
        </VisualisationDataContext.Provider>
    )
}

export const useVisualisationData = () => {
    const context = useContext(VisualisationDataContext)
    if (context === undefined) {
        throw new Error('useVisualisationData must be used within a <VisualisationDataProvider/>')
    }
    return context
}
