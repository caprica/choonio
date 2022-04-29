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
import { ReactNode } from 'react'

const useStyles = makeStyles({
    root: {
        display: 'inline-block',
        border: '0.2rem solid #fff',
        borderRadius: '2rem',
        boxShadow:
            '0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe, 0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe'
    },
    shadow2: {
        boxShadow:
            '0 0 0.1rem #fff, 0 0 0.1rem #fff, 0 0 1rem #bc13fe, 0 0 0.4rem #bc13fe, 0 0 1.4rem #bc13fe, inset 0 0 0.15rem #bc13fe'
    }
})

interface NeonFrameProps {
    className?: string
    glow2?: boolean
    children: ReactNode
}

export default function NeonFrame({ className, glow2, children }: NeonFrameProps) {
    const classes = useStyles()

    return <div className={clsx(className, classes.root, { [classes.shadow2]: glow2 })}>{children}</div>
}
