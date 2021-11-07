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

import { CircularProgress, Paper, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { ReactNode } from 'react'
import { ApplicationStatus } from '../api/model/event-model'
import { useStatus } from '../hooks/server-sent-events/useStatus'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#f5f5f5',
        height: '100vh'
    },
    content: {
        paddingTop: 250,
        display: 'grid',
        alignItems: 'center',
        justifyItems: 'center'
    },
    body: {
        padding: theme.spacing(4, 8),
        display: 'grid',
        rowGap: theme.spacing(2),
        justifyItems: 'center'
    }
}))

interface StatusInterstitialProps {
    children?: ReactNode
}

const captionForStatus = (status?: ApplicationStatus) => {
    switch (status) {
        case ApplicationStatus.Searchmedia:
            return 'Scanning media files...'
        case ApplicationStatus.GenerateArtwork:
            return 'Generating artwork...'
        default:
            return ''
    }
}

export default function StatusInterstitial({ children }: StatusInterstitialProps) {
    const classes = useStyles()

    const { status } = useStatus()

    if (status.status === ApplicationStatus.Ready) return <>{children}</>

    let progressType: 'static' | 'indeterminate' | 'determinate' | undefined = 'indeterminate'
    switch (status.status) {
        case ApplicationStatus.GenerateArtwork:
            progressType = 'determinate'
            break
        default:
            break
    }

    const progress = status.progress ? status.progress * 100 : undefined

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Paper className={classes.body} elevation={3}>
                    <Typography>Please wait for the application to be ready...</Typography>
                    <CircularProgress variant={progressType} value={progress} />
                    <Typography variant='caption'>{captionForStatus(status.status)}</Typography>
                </Paper>
            </div>
        </div>
    )
}
