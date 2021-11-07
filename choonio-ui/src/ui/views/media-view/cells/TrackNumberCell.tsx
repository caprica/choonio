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

import makeStyles from '@mui/styles/makeStyles'
import { MdPlayArrow } from 'react-icons/md'

import TrackPlaying from '../../../../components/track-playing/TrackPlaying'
import MediaViewListCell from '../MediaViewListCell'
import { useNowPlaying } from '../../../../hooks/server-sent-events/useNowPlaying'
import { useTrackActions } from '../../../../hooks/actions/useTrackActions'
import { AlbumTrackData } from '../../../../api/model/albums-model'

const useStyles = makeStyles({
    numberColumn: {
        width: '42px'
    },
    playIcon: {
        fontSize: '32px',
        color: '#212121',
        verticalAlign: 'middle'
    }
})

interface TrackNumberCellProps {
    num?: number
    track: AlbumTrackData
    active?: boolean
}

export default function TrackNumberCell({ num, track, active }: TrackNumberCellProps) {
    const classes = useStyles()

    const { playTrack } = useTrackActions()

    const nowPlaying = useNowPlaying()

    const onClickPlay = () => playTrack(track.mediaId)

    const playingThisTrack =
        nowPlaying &&
        track.mediaId.trackName === nowPlaying.trackId.trackName &&
        track.mediaId.albumName === nowPlaying.trackId.albumName &&
        track.mediaId.albumArtistName === nowPlaying.trackId.albumArtistName

    return (
        <MediaViewListCell className={classes.numberColumn} secondary align='right'>
            <>
                {active ? (
                    <span onClick={onClickPlay}>
                        <MdPlayArrow className={classes.playIcon} />
                    </span>
                ) : playingThisTrack ? (
                    <TrackPlaying />
                ) : (
                    <span>{num || track.number}</span>
                )}
            </>
        </MediaViewListCell>
    )
}
