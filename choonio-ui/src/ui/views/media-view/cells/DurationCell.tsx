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

import makeStyles from '@mui/styles/makeStyles'
import MediaViewListCell from '../MediaViewListCell'
import { formatDuration } from '../../../../lib/duration/duration'
import { AlbumTrackData } from '../../../../api/model/albums-model'

const useStyles = makeStyles({
    durationColumn: {
        width: '60px'
    }
})

interface DurationCellProps {
    track: AlbumTrackData
}

export default function DurationCell({ track }: DurationCellProps) {
    const classes = useStyles()

    return (
        <MediaViewListCell className={classes.durationColumn} secondary align='right'>
            {formatDuration(track.duration)}
        </MediaViewListCell>
    )
}
