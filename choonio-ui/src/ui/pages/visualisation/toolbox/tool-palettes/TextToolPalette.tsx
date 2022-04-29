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

import { useVisualisationOptions } from '../../hooks/options/visualisation-options-context'
import DecimalTool from '../tools/input-tool/DecimalTool'
import IntegerTool from '../tools/input-tool/IntegerTool'
import SelectTool from '../tools/select-tool/SelectTool'
import ToolPalette from './ToolPalette'

import { fontFamilyOptions } from './options/font-family-options'
import { fontWeightOptions } from './options/font-weight-options'
import { textModeOptions } from './options/text-mode-options'

export default function TextToolPalette() {
    const { options, setOptions } = useVisualisationOptions()

    const handleFontFamilyChange = (fontFamily: string) => setOptions({ ...options, fontFamily })
    const handleFontWeightChange = (fontWeight: string) => setOptions({ ...options, fontWeight })
    const handleTextModeChange = (textMode: string) => setOptions({ ...options, textMode })
    const handleMinimumTextSizeChange = (minimumTextSize: number) => setOptions({ ...options, minimumTextSize })
    const handleMinRotationChange = (minRotation: number) => setOptions({ ...options, minRotation })
    const handleMaxRotationChange = (maxRotation: number) => setOptions({ ...options, maxRotation })
    const handleRotationStepsChange = (rotationSteps: number) => setOptions({ ...options, rotationSteps })
    const handleRotationProbabilityChange = (rotationProbability: number) => setOptions({ ...options, rotationProbability })

    return (
        <ToolPalette caption='Text'>
            <SelectTool
                caption='Font family'
                value={options.fontFamily}
                options={fontFamilyOptions}
                onChange={handleFontFamilyChange}
            />
            <SelectTool
                caption='Font weight'
                value={options.fontWeight}
                options={fontWeightOptions}
                onChange={handleFontWeightChange}
            />
            <SelectTool caption='Text mode' value={options.textMode} options={textModeOptions} onChange={handleTextModeChange} />
            <IntegerTool caption='Minimum size' min={1} value={options.minimumTextSize} onChange={handleMinimumTextSizeChange} />
            <DecimalTool
                caption='Minimum angle'
                min={-360}
                max={360}
                value={options.minRotation}
                onChange={handleMinRotationChange}
            />
            <DecimalTool
                caption='Maximum angle'
                min={-360}
                max={360}
                value={options.maxRotation}
                onChange={handleMaxRotationChange}
            />
            <IntegerTool caption='Fixed angles' min={0} value={options.rotationSteps} onChange={handleRotationStepsChange} />
            <DecimalTool
                caption='Rotation probability'
                value={options.rotationProbability}
                onChange={handleRotationProbabilityChange}
            />
        </ToolPalette>
    )
}
