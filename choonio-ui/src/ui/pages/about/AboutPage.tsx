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

import { Container, Paper, Typography } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(8),
        display: 'grid',
        rowGap: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(2)
    },
    heading: {
        paddingBottom: theme.spacing(2)
    },
    text: {
        paddingBottom: theme.spacing(1)
    },
    link: {
        color: theme.palette.primary.main
    }
}))

const AboutPage = (): JSX.Element => {
    const classes = useStyles()

    return (
        <Container className={classes.root} maxWidth='sm'>
            <Paper elevation={3} style={{ padding: 32 }}>
                <Typography className={classes.heading} variant='h5'>
                    About
                </Typography>
                <Typography className={classes.text} variant='body2'>
                    This project is an homage to Google Play Music, a pretty good streaming service killed by Google in 2020.
                </Typography>
                <Typography className={classes.text} variant='body2'>
                    A nicer about page may be written at some point, but for now see{' '}
                    <a className={classes.link} href='http://github.com/caprica/choonio'>
                        the GitHub project page
                    </a>
                    .
                </Typography>
                <Typography className={classes.text} variant='body2' color='textSecondary'>
                    &copy; 2021 Caprica Software Limited
                </Typography>
            </Paper>
        </Container>
    )
}

export default AboutPage
