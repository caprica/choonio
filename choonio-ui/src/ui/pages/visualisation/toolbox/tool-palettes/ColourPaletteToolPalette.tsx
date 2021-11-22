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

import { useVisualisationOptions } from '../../hooks/options/visualisation-options-context'
import ToolPalette from './ToolPalette'
import ColourPaletteTool from '../tools/colour-palette-tool/ColourPaletteTool'
import { useVisualisationPalettes } from '../../hooks/palette/visualisation-palettes-context'
import ColourTool from '../tools/colour-tool/ColourTool'
import ButtonTool from '../tools/button-tool/ButtonTool'
import { getNewPalette } from '../../lib/palette-utils'
import { ColourPalette } from '../tools/colour-palette-tool/colour-palette-tool'

export default function ColourPaletteToolPalette() {
    const { options, setOptions } = useVisualisationOptions()

    const { palettes, addPalette } = useVisualisationPalettes()

    const handleChange = (name: string) => (newValue: boolean) => {
        let palettes
        if (newValue) {
            palettes = [...options.palettes, name]
        } else {
            palettes = options.palettes.filter((palette: string) => palette !== name)
        }
        setOptions({ ...options, palettes })
    }

    const handleDefaultColourChange = (defaultColour: string) => setOptions({ ...options, defaultColour })

    const handleClickAddPalette = () => addPalette(getNewPalette(palettes))

    return (
        <ToolPalette caption='Palette'>
            {palettes.map((palette: ColourPalette) => (
                <ColourPaletteTool
                    key={palette.name}
                    caption={palette.name}
                    palette={palette}
                    value={options.palettes.includes(palette.name)}
                    onChange={handleChange(palette.name)}
                />
            ))}
            <ButtonTool caption='' value='Add palette...' onClick={handleClickAddPalette} />
            <ColourTool caption='Default colour' value={options.defaultColour} onChange={handleDefaultColourChange} />
        </ToolPalette>
    )
}
