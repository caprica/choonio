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

import { createContext, ReactNode, useContext, useState } from 'react'
import { ColourPalette } from '../../toolbox/tools/colour-palette-tool/colour-palette-tool'

import { standardPalettes } from './standard-palettes'

const LOCAL_STORAGE_OPTIONS_KEY = `${process.env.REACT_APP_NAME}.palettes`

const loadPalettes = (): Array<ColourPalette> => {
    // if (standardPalettes) return standardPalettes

    const json = localStorage.getItem(LOCAL_STORAGE_OPTIONS_KEY)
    if (json) {
        try {
            return JSON.parse(json)
        } catch (e) {
            console.log('Failed to load stored palettes')
            console.log(e)
        }
    }
    return [...standardPalettes]
}

const savePalettes = (palettes: Array<ColourPalette>) => {
    localStorage.setItem(LOCAL_STORAGE_OPTIONS_KEY, JSON.stringify(palettes))
}

// May not need all of these methods in fact...
interface VisualisationPalettesContextProps {
    palettes: Array<ColourPalette>
    setPalettes: (palettes: Array<ColourPalette>) => void
    getPalette: (name: string) => ColourPalette | undefined
    setPalette: (palette: ColourPalette) => void
    addPalette: (palette: ColourPalette) => void
    updatePalette: (name: string, palette: ColourPalette) => void
    deletePalette: (name: string) => void
    resetPalettes: () => void
}

export const VisualisationPalettesContext = createContext<VisualisationPalettesContextProps | undefined>(undefined)

interface VisualisationPalettesContextProviderProps {
    children?: ReactNode
}

export const VisualisationPalettesContextProvider = ({ children }: VisualisationPalettesContextProviderProps) => {
    const [palettes, setPalettes] = useState(loadPalettes())

    const getPalette = (name: string) => palettes.find((palette: ColourPalette) => palette.name === name)

    const wrappedSetPalettes = (newPalettes: Array<ColourPalette>) => {
        newPalettes.sort((palette1: ColourPalette, palette2: ColourPalette) => palette1.name.localeCompare(palette2.name))
        savePalettes(newPalettes)
        setPalettes(newPalettes)
    }

    const resetPalettes = () => {
        wrappedSetPalettes([...standardPalettes])
    }

    const setPalette = (newPalette: ColourPalette) => {
        for (let i = 0; i < palettes.length; i++) {
            const pal = palettes[i]
            if (pal.name === newPalette.name) {
                pal.colours = [...newPalette.colours]
                wrappedSetPalettes([...palettes])
                return
            }
        }
    }

    // Future: do not allow adding another one with the same name
    const addPalette = (newPalette: ColourPalette) => {
        const newPalettes = [...palettes, newPalette]
        wrappedSetPalettes(newPalettes)
    }

    const updatePalette = (name: string, palette: ColourPalette) => {
        const newPalettes = [...palettes.filter((palette: ColourPalette) => palette.name !== name), palette]
        wrappedSetPalettes(newPalettes)
    }

    const deletePalette = (name: string) => {
        const newPalettes = palettes.filter((palette: ColourPalette) => palette.name !== name)
        wrappedSetPalettes(newPalettes)
    }

    return (
        <VisualisationPalettesContext.Provider
            value={{
                palettes,
                setPalettes: wrappedSetPalettes,
                getPalette,
                setPalette,
                addPalette,
                updatePalette,
                deletePalette,
                resetPalettes
            }}
        >
            {children}
        </VisualisationPalettesContext.Provider>
    )
}

export const useVisualisationPalettes = () => {
    const context = useContext(VisualisationPalettesContext)
    if (context === undefined) {
        throw new Error('useVisualisationPalettes must be used within a <VisualisationPalettesProvider/>')
    }
    return context
}
