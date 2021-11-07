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
 */

import React, { ReactNode } from 'react'
import { useState } from 'react'
import clsx from 'clsx'

import makeStyles from '@mui/styles/makeStyles'
import TableRow from '@mui/material/TableRow'

const useStyles = makeStyles({
    row: {
        height: '40px',
        lineHeight: '40px',
        maxHeight: '40px',
        minHeight: '40px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        verticalAlign: 'middle',
        // textIndent: 4
        '& td': {
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        }
    },
    active: {
        cursor: 'pointer',
        backgroundColor: '#eeeeee'
    }
})

const cloneChild = (child: ReactNode, active: boolean) => {
    if (React.isValidElement(child)) {
        return React.cloneElement(child, { active })
    }
}

interface MediaViewListItemProps {
    children: ReactNode
}

export default function MediaViewListItem({ children }: MediaViewListItemProps) {
    const classes = useStyles()

    const [active, setActive] = useState(false)

    const handleEnter = () => setActive(true)
    const handleExit = () => setActive(false)

    return (
        <TableRow
            className={clsx(classes.row, { [classes.active]: active })}
            onMouseEnter={handleEnter}
            onMouseLeave={handleExit}
        >
            {/* Clone the children to propagate the active property */}
            {React.Children.map(children, child => cloneChild(child, active))}
        </TableRow>
    )
}
