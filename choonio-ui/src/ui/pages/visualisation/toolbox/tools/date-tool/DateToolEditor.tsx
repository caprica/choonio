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

import makeStyles from '@mui/styles/makeStyles'
import { Box, Popover } from '@mui/material'
import { MouseEvent, useState } from 'react'
import DateTime from 'react-datetime'
import ToolButton from '../ToolButton'
import moment from 'moment'

import 'react-datetime/css/react-datetime.css'
import './DateToolEditor.css'
import { StringToolEditorProps } from '../tool'

const DATE_FORMAT = 'YYYY-MM-DD'

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%'
    }
})

export default function DateToolEditor({ value, onChange }: StringToolEditorProps) {
    const classes = useStyles()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleChange = (value: any) => {
        setAnchorEl(null)
        value = moment(value).format('YYYY-MM-DD')
        onChange(value)
    }

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)

    const handleClose = () => setAnchorEl(null)

    return (
        <div className={classes.root}>
            <ToolButton onClick={handleClick} caption={value} />
            <Popover
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                BackdropProps={{ style: { opacity: 0 } }}
                PaperProps={{ elevation: 24, style: { borderRadius: 0, backgroundColor: '#222222', padding: 16 } }}
            >
                <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <DateTime
                        input={false}
                        className='cursor-pointer'
                        dateFormat={DATE_FORMAT}
                        timeFormat={false}
                        closeOnSelect
                        value={value}
                        onChange={handleChange}
                    />
                </Box>
            </Popover>
        </div>
    )
}
