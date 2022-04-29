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

import { createContext, ReactNode, useContext, useState } from 'react'
import { VisualisationOptions } from '../../lib/visualisation-options'

import { defaultVisualisationOptions } from './default-visualisation-options'

// The storage for this will be migrated to the database instead of local storage

const LOCAL_STORAGE_OPTIONS_KEY = `${process.env.REACT_APP_NAME}.options`

const loadOptions = (): VisualisationOptions => {
    const json = localStorage.getItem(LOCAL_STORAGE_OPTIONS_KEY)
    if (json) {
        try {
            return JSON.parse(json)
        } catch (e) {
            console.log('Failed to load stored options')
            console.log(e)
        }
    }
    return { ...defaultVisualisationOptions }
}

const saveOptions = (options: VisualisationOptions) => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS_KEY, JSON.stringify(options))
}

interface VisualisationOptionsContextProps {
    options: VisualisationOptions
    setOptions: (newOptions: VisualisationOptions) => void
    resetOptions: () => void
}

export const VisualisationOptionsContext = createContext<VisualisationOptionsContextProps | undefined>(undefined)

interface VisualisationOptionsContextProviderProps {
    children?: ReactNode
}

export const VisualisationOptionsContextProvider = ({ children }: VisualisationOptionsContextProviderProps) => {
    const [options, setOptions] = useState(loadOptions())

    const wrappedSetOptions = (newOptions: VisualisationOptions) => {
        saveOptions(newOptions)
        setOptions(newOptions)
    }
    const resetOptions = () => {
        wrappedSetOptions({ ...defaultVisualisationOptions })
    }

    return (
        <VisualisationOptionsContext.Provider value={{ options, setOptions: wrappedSetOptions, resetOptions }}>
            {children}
        </VisualisationOptionsContext.Provider>
    )
}

export const useVisualisationOptions = () => {
    const context = useContext(VisualisationOptionsContext)
    if (context === undefined) {
        throw new Error('useVisualisationOptions must be used within a <VisualisationOptionsProvider/>')
    }
    return context
}
