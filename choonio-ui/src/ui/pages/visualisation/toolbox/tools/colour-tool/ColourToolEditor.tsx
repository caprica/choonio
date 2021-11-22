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

import { MouseEvent, useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { Box, Menu, Popover } from '@mui/material'
import { HexColorPicker } from 'react-colorful'
import { useDebouncyFn } from 'use-debouncy'
import ColourToolEditorSwatch from './ColourToolEditorSwatch'
import { StringToolEditorProps } from '../tool'

import './ColourToolEditor.css'

const DEBOUNCE_PERIOD = 200

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%'
    }
})

export default function ColourToolEditor({ value, onChange }: StringToolEditorProps) {
    const classes = useStyles()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const open = Boolean(anchorEl)

    const debounceFn = useDebouncyFn((newValue: string) => onChange(newValue), DEBOUNCE_PERIOD)

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)

    const handleClose = () => setAnchorEl(null)

    return (
        <div className={classes.root}>
            <ColourToolEditorSwatch value={value} onClick={handleClick} />
            <Popover
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                BackdropProps={{ style: { opacity: 0 } }}
                PaperProps={{ elevation: 24, style: { borderRadius: 0, backgroundColor: '#222222', padding: 16 } }}
            >
                <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <HexColorPicker color={value} onChange={debounceFn} />
                </Box>
            </Popover>
        </div>
    )
}
