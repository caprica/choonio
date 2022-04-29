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

import { TableCell } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const useStyles = makeStyles({
    icon: {
        fontSize: '16px',
        lineHeight: '16px',
        verticalAlign: 'middle'
    },
    tableCell: {
        height: '40px',
        padding: '0 12px',
        color: '#616161',
        borderColor: 'rgba(0,0,0,0.06)'
    },
    tableHeaderCell: {
        color: '#212121',
        fontWeight: 600,
        textTransform: 'uppercase',
        borderBottom: 'none',
        fontSize: '12px'
    }
})

export interface MediaViewListHeader {
    id: string
    caption?: string
    icon?: JSX.Element
    align?: 'left' | 'center' | 'right'
}

interface MediaViewListHeadersProps {
    headers: Array<MediaViewListHeader>
}

export default function MediaViewListHeaders({ headers }: MediaViewListHeadersProps) {
    const classes = useStyles()

    return (
        <TableHead>
            <TableRow>
                {headers.map(header => (
                    <TableCell
                        key={header.id}
                        align={header.align}
                        classes={{ root: classes.tableCell, head: classes.tableHeaderCell }}
                    >
                        {header.caption}
                        {header.icon && <span className={classes.icon}>{header.icon}</span>}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}
