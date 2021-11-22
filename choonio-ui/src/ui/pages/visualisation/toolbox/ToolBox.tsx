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

import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

import ColourPaletteToolPalette from './tool-palettes/ColourPaletteToolPalette'
import DataFiltersToolPalette from './tool-palettes/DataFiltersToolPalette'
import HighlightsToolPalette from './tool-palettes/HighlightsToolPalette'
import ImageToolPalette from './tool-palettes/ImageToolPalette'
import RandomiserToolPalette from './tool-palettes/RandomiserToolPalette'
import TextToolPalette from './tool-palettes/TextToolPalette'
import LayoutToolPalette from './tool-palettes/LayoutToolPalette'

const useStyles = makeStyles({
    root: {
        color: 'white',
        backgroundColor: '#202020',
        border: 'solid black',
        borderWidth: '4px 2px 1px',
        minWidth: 316,
        paddingBottom: 32
    }
})

interface ToolBoxProps {
    className?: string
}

export default function ToolBox({ className }: ToolBoxProps) {
    const classes = useStyles()

    return (
        <div className={clsx(className, classes.root)}>
            <RandomiserToolPalette />
            <DataFiltersToolPalette />
            <ImageToolPalette />
            <LayoutToolPalette />
            <TextToolPalette />
            <ColourPaletteToolPalette />
            <HighlightsToolPalette />
        </div>
    )
}
