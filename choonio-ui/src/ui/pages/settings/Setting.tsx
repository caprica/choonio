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

import { ReactNode } from 'react'
import { Typography } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

interface SettingProps {
    caption: string
    description?: string
    children: ReactNode
}

const useStyles = makeStyles({
    root: {
        display: 'grid',
        rowGap: '8px'
    }
})

export default function Setting({ caption, description, children }: SettingProps) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Typography variant='subtitle2' style={{ fontSize: '13px' }}>
                {caption}
            </Typography>
            {description && <Typography style={{ fontSize: '13px' }}>{description}</Typography>}
            <div>{children}</div>
        </div>
    )
}
