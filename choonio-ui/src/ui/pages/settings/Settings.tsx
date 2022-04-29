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

import { ReactNode } from 'react'
import { Paper, Typography } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

interface SettingsProps {
    caption?: string
    children: ReactNode
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    caption: {
        marginBottom: theme.spacing(1)
    },
    settings: {
        display: 'grid',
        rowGap: '16px'
    }
}))

export default function Settings({ caption, children }: SettingsProps) {
    const classes = useStyles()

    return (
        <Paper className={classes.root} square elevation={3}>
            {caption && (
                <Typography className={classes.caption} variant='h6'>
                    {caption}
                </Typography>
            )}
            <div className={classes.settings}>{children}</div>
        </Paper>
    )
}
