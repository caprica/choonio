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

import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { KeyboardEvent } from 'react'

const useStyles = makeStyles({
    root: {
        width: '1.5rem',
        height: '1.5rem',
        border: '1px solid black'
    },
    noValue: {
        // background: 'repeating-conic-gradient(#888 0% 25%, #444 0% 50%) 50% / 1.5rem 1.5rem'
        background: 'repeating-conic-gradient(#888 0% 25%, #444 0% 50%) 50% / 1.5rem 1.5rem'
    },
    active: {
        border: '2px solid orangered'
    }
})

interface PaletteToolSwatchProps {
    value?: string
    active?: boolean
    onClick: () => void
    onDelete: () => void
}

export default function ColourPaletteToolSwatch({ value, active, onClick, onDelete }: PaletteToolSwatchProps) {
    const classes = useStyles()

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => event.key === 'Delete' && onDelete()

    return (
        <button
            className={clsx(classes.root, { [classes.active]: active, [classes.noValue]: value === undefined })}
            style={{ backgroundColor: value }}
            onClick={onClick}
            onKeyDown={handleKeyDown}
        />
    )
}
