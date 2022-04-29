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
import ButtonTool from '../tools/button-tool/ButtonTool'
import TextTool from '../tools/input-tool/TextTool'
import ToolPalette from './ToolPalette'

import seedrandom from 'seedrandom'

const rng = seedrandom()

export default function ImageToolPalette() {
    const { options, setOptions } = useVisualisationOptions()

    const handleSeedChange = (seed: string) => setOptions({ ...options, seed })
    const handleGenerateSeed = () => setOptions({ ...options, seed: '' + rng.int32() })

    return (
        <ToolPalette caption='Randomiser'>
            <TextTool caption='Random seed' value={options.seed} onChange={handleSeedChange} />
            <ButtonTool caption='' value='New random seed' onClick={handleGenerateSeed} />
        </ToolPalette>
    )
}
