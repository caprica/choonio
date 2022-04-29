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

// https://css-tricks.com/how-to-create-neon-text-with-css/

const useStyles = makeStyles({
    root: {
        fontFamily: 'Vibur',
        // fontFamily: 'Yellowtail',
        // fontFamily: 'Sacramento',
        fontWeight: 400,
        fontSize: '3.2rem',
        color: '#fff',
        textShadow:
            '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #bc13fe, 0 0 82px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe'
    }
})

interface NeonTextProps {
    className?: string
    children: ReactNode
}

export default function NeonText({ className, children }: NeonTextProps) {
    const classes = useStyles()

    return <div className={clsx(className, classes.root)}>{children}</div>
}
