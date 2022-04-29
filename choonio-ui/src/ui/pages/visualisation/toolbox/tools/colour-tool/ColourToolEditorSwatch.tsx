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

import { MouseEvent } from 'react'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        color: 'unset',
        backgroundColor: 'unset',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        alignItems: 'center'
    },
    swatch: {
        width: 48,
        height: 12,
        border: '1px solid black',
        marginRight: 8
    },
    grow: {
        flexGrow: 1
    },
    ellipsis: {
        justifySelf: 'flex-end',
        alignSelf: 'flex-end'
    }
})

interface ColourToolEditorSwatchProps {
    value: string
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function ColourToolEditorSwatch({ value, onClick }: ColourToolEditorSwatchProps) {
    const classes = useStyles()

    return (
        <button className={classes.root} onClick={onClick}>
            <div className={classes.swatch} style={{ backgroundColor: value }} />
            <span className={classes.grow} />
            <span className={classes.ellipsis}>...</span>
        </button>
    )
}
