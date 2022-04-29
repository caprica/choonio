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
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import MediaViewListHeaders, { MediaViewListHeader } from './MediaViewListHeaders'
import { ReactNode } from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2, 1)
    },
    table: {
        '& tbody tr:last-child *': {
            border: 'none'
        }
    }
}))

interface MediaViewListProps {
    className?: string
    headers: Array<MediaViewListHeader>
    children: ReactNode
}

export default function MediaViewList({ className, headers, children }: MediaViewListProps) {
    const classes = useStyles()

    return (
        <TableContainer className={clsx(className, classes.root)} component={Paper} elevation={3} style={{ width: 'unset' }}>
            <Table className={classes.table} aria-label='media list'>
                <MediaViewListHeaders headers={headers} />
                <TableBody>{children}</TableBody>
            </Table>
        </TableContainer>
    )
}
