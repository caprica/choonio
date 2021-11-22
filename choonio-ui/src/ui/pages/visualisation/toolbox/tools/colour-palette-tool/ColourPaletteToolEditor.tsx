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

import { ChangeEvent, MouseEvent, useState } from 'react'
import ColourPaletteToolSwatches from './ColourPaletteToolSwatches'
import ColourPaletteToolPaletteEditor from './ColourPaletteToolPaletteEditor'

import { makeStyles } from '@mui/styles'
import { Box, Popover } from '@mui/material'
import { ColourPalette } from './colour-palette-tool'
import { BooleanToolEditorProps } from '../tool'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    checkBox: {},
    swatches: {
        maxWidth: 112
    }
})

interface ColourPaletteToolEditorProps extends BooleanToolEditorProps {
    palette: ColourPalette
}

export default function ColourPaletteToolEditor({ value, palette, onChange }: ColourPaletteToolEditorProps) {
    const classes = useStyles()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClickSwatches = (event: MouseEvent<HTMLDivElement>) => setAnchorEl(event.currentTarget)

    const handlePopoverClose = (_event: any, reason: string) => reason === 'escapeKeyDown' && setAnchorEl(null)

    const handlePaletteEditorClose = () => setAnchorEl(null)

    const handleCheckedChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)

    return (
        <div className={classes.root} style={{ width: '100%', height: '100%' }}>
            <input className={classes.checkBox} type='checkbox' checked={value} onChange={handleCheckedChange} />
            <ColourPaletteToolSwatches className={classes.swatches} colours={palette.colours} onClick={handleClickSwatches} />
            <Popover
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                anchorEl={anchorEl}
                open={open}
                onClose={handlePopoverClose}
                BackdropProps={{ style: { opacity: 0 } }}
                PaperProps={{ elevation: 24, style: { borderRadius: 0, padding: 12, backgroundColor: '#222222' } }}
            >
                <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <ColourPaletteToolPaletteEditor palette={palette} onClose={handlePaletteEditorClose} />
                </Box>
            </Popover>
        </div>
    )
}
