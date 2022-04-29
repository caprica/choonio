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
import TableCell from '@mui/material/TableCell'
import { ReactNode } from 'react'

const useStyles = makeStyles({
    tableCell: {
        height: '40px',
        padding: '0 12px',
        color: 'black',
        fontWeight: 400,
        borderColor: 'rgba(0,0,0,0.06)'
    },
    primary: {},
    secondary: {
        color: '#616161'
    }
})

interface MediaViewListCellProps {
    className?: string
    primary?: boolean
    secondary?: boolean
    align?: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
    children: ReactNode
}

export default function MediaViewListCell({ className, primary, secondary, align, children }: MediaViewListCellProps) {
    const classes = useStyles()

    return (
        <TableCell
            className={clsx(className, { [classes.primary]: primary, [classes.secondary]: secondary })}
            align={align}
            classes={{ root: classes.tableCell }}
        >
            {children}
        </TableCell>
    )
}
