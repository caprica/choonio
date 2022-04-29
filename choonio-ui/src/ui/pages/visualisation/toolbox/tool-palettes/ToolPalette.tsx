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
import { ReactNode } from 'react'

const useStyles1 = makeStyles({
    root: {},
    caption: {
        padding: '8px 12px',
        fontWeight: 'bold',
        backgroundColor: '#1a202c',
        borderBottom: '1px solid rgb(74,85,104)'
    },
    tools: {
        backgroundColor: '#333'
    },
    tool: {
        display: 'flex',
        borderBottom: '1px solid rgb(74,85,104)'
    }
})

interface ToolPaletteProps {
    caption: string
    children: ReactNode
}

export default function ToolPalette({ caption, children }: ToolPaletteProps) {
    const classes = useStyles1()

    return (
        <div className={classes.root}>
            <div className={classes.caption}>{caption}</div>
            <div className={classes.tools}>{children}</div>
        </div>
    )
}
