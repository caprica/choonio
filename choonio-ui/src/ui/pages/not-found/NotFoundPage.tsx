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

import { Paper } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { Container, Typography } from '@mui/material'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(16, 4)
    },
    content: {
        padding: theme.spacing(4)
    },
    header: {
        marginBottom: theme.spacing(2)
    },
    text: {}
}))

export default function NotFoundPage() {
    const classes = useStyles()

    return (
        <Container className={classes.root} maxWidth='sm'>
            <Paper className={classes.content}>
                <div className={classes.header}>
                    <Typography variant='h5'>Oops!</Typography>
                </div>
                <div className={classes.text}>
                    <Typography variant='body2'>You ended up somewhere that does not exist, sorry about that!</Typography>
                </div>
            </Paper>
        </Container>
    )
}
