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

import FontFaceObserver from 'fontfaceobserver'
import WordCloud from '../../../lib/wordlcloud/wordcloud2'
import seedrandom from 'seedrandom'
import { VisualisationOptions } from './visualisation-options'
import { ColourPalette } from '../toolbox/tools/colour-palette-tool/colour-palette-tool'

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180)

const getRandomInt = (min: number, max: number, rng: any) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(rng.random() * (max - min + 1)) + min
}

const isTopRank = (artist: string, data: any, ranks: number) => {
    // This is a simple linear search but we don't expect to iterate many elements
    for (let i = 0; i < ranks; i++) {
        if (data[i].word === artist) {
            return true
        }
    }
    return false
}

const pickColour = (
    data: any,
    options: VisualisationOptions,
    word: string,
    availablePalettes: Array<ColourPalette>,
    rng: any
) => {
    if (isTopRank(word, data, options.highlightTopRanks)) {
        rng.random() // Consume a random value to account for this colour
        rng.random() // Consume a random value to account for this colour
        return options.topRanksColour
    }
    const selectedPalettes = options.palettes
    if (selectedPalettes.length > 0) {
        const name = selectedPalettes[getRandomInt(0, selectedPalettes.length - 1, rng)]
        const palette = availablePalettes.filter(p => p.name === name)
        if (palette.length > 0) {
            const colours = palette[0].colours
            return colours[getRandomInt(0, colours.length - 1, rng)]
        } else {
            rng.random()
            return options.defaultColour
        }
    } else {
        // We need to make sure we always make the same number of calls to the RNG if we want repeatable behaviour
        // ideally we'd have two separate random generators then
        rng.random()
        rng.random()
        return options.defaultColour
    }
}

export const generateWordCloud = (
    element: any,
    data: any,
    options: VisualisationOptions,
    availablePalettes: Array<ColourPalette>,
    onAborted: () => void,
    onClick: (value: string) => void
) => {
    const handleAbort = () => onAborted()

    const handleClick = (props: any) => onClick(props.original)

    // The font is loaded lazily on first access, this means usually the first string is rendered in a default
    // font, so wait until the font is loaded before rendering
    new FontFaceObserver(options.fontFamily).load().then(
        () => {
            const datax = options.top > 0 ? data.slice(0, options.top) : data

            const rng = seedrandom(options.seed)
            const myRng = {
                random: () => rng()
            }

            WordCloud(element, {
                list: datax,
                backgroundColor: options.backgroundColour,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                color: (word: string, _weight: number, _fontSize: number, _distance: number, _theta: number) =>
                    pickColour(datax, options, word, availablePalettes, myRng),
                drawOutOfBound: true,
                clearCanvas: true,
                minSize: options.minimumTextSize,
                shuffle: false,
                gridSize: options.gridSize,
                minRotation: degreesToRadians(options.minRotation),
                maxRotation: degreesToRadians(options.maxRotation),
                rotationSteps: options.rotationSteps !== 1 ? options.rotationSteps : 0,
                rotateRatio: options.rotationProbability,
                shape: options.shape,
                ellipticity: options.flatness,
                weightFactor: options.scale,
                fontFamily: options.fontFamily,
                fontWeight: options.fontWeight,
                wait: 0,
                origin: [options.width / 2 + options.originX, options.height / 2 + options.originY],
                rng: rng,
                abortThreshold: 2500,
                abort: handleAbort,
                click: handleClick
            })
        },
        (_err: any) => {
            console.log('Failed to load font: ' + options.fontFamily)
        }
    )
}
