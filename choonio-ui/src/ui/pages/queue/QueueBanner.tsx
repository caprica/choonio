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

import AlbumBanner from '../../../components/covers/AlbumBanner'

import { useNowPlaying } from '../../../hooks/server-sent-events/useNowPlaying'
import { Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { formatDuration } from '../../../lib/duration/duration'
import { pluralise } from '../../../lib/pluralise/pluralise'
import { PlaylistData } from '../../../api/model/playlists-model'
import { TrackIdentity } from '../../../api/model/identity-model'

const useStyles = makeStyles({
    root: {
        position: 'relative'
    }
})

interface QueueBannerProps {
    queue: PlaylistData
}

export default function QueueBanner({ queue }: QueueBannerProps) {
    const classes = useStyles()

    const nowPlaying = useNowPlaying()

    // For the queue, unlike playlists the duration is not available here so we must calculate it
    const duration = queue.items.map(item => item.track.duration).reduce((total, duration) => total + duration, 0)

    const mediaId: TrackIdentity = nowPlaying ? nowPlaying.trackId : queue.items[0].track.mediaId

    return (
        <div className={classes.root}>
            <AlbumBanner artistName={mediaId.albumArtistName} albumName={mediaId.albumName} />
            <Typography
                style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: 12,
                    bottom: 12,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    padding: '0 8px',
                    fontWeight: 600
                }}
                variant='body2'
            >
                <span>
                    {mediaId.trackName}, by {mediaId.albumArtistName}
                </span>
            </Typography>
            <Typography
                style={{
                    fontSize: '16px',
                    position: 'absolute',
                    right: 20,
                    bottom: 12,
                    color: 'white',
                    fontWeight: 400
                }}
                variant='body2'
            >
                <span>
                    {queue.description} • {pluralise('track', queue.items.length)} • {formatDuration(duration)}
                </span>
            </Typography>
        </div>
    )
}
