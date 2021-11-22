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

import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import { MouseEvent } from 'react'
import ColourPaletteToolSwatch from './ColourPaletteToolSwatch'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        cursor: 'pointer'
    }
})

interface ColourPaletteToolSwatchesProps {
    className?: string
    colours: Array<string>
    onClick: (event: MouseEvent<HTMLDivElement>) => void
}

export default function ColourPaletteToolSwatches({ className, colours, onClick }: ColourPaletteToolSwatchesProps) {
    const classes = useStyles()

    return (
        <div className={clsx(className, classes.root)} onClick={onClick}>
            {colours.map(colour => (
                <ColourPaletteToolSwatch key={colour} value={colour} />
            ))}
        </div>
    )
}
