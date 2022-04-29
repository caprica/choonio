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

import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import { MouseEvent } from 'react'

interface ToolButtonProps {
    className?: string
    caption: string
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

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
    },
    content: {
        display: 'flex'
    },
    caption: {
        flexGrow: 1
    },
    ellipsis: {
        justifySelf: 'flex-end'
    }
})

export default function ToolButton({ className, caption, onClick }: ToolButtonProps) {
    const classes = useStyles()

    return (
        <button className={clsx(classes.root, className)} onClick={onClick}>
            <span className={classes.content}>
                <span className={classes.caption}>{caption}</span>
                <span className={classes.ellipsis}>...</span>
            </span>
        </button>
    )
}
