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

import { makeStyles } from '@mui/styles'
import { StringToolEditorProps } from '../tool'

const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        textAlign: 'left',
        color: 'unset',
        backgroundColor: 'unset',
        border: 'none',
        padding: 0,
        alignContent: 'center',
        cursor: 'pointer'
    }
})

interface ButtonToolEditorProps extends StringToolEditorProps {
    onClick: () => void
}

export default function ButtonToolEditor({ value, onClick }: ButtonToolEditorProps) {
    const classes = useStyles()

    const handleClick = () => onClick()

    return (
        <button className={classes.root} onClick={handleClick}>
            {value}
        </button>
    )
}
