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
import { AlbumTrackData } from '../../../../api/model/albums-model'

const useStyles = makeStyles({
    title: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'default'
    },
    titleColumn: {
        // width: '100%'    // need to use this, but it slight glitches on the icon change in column 0
    }
})

interface NameCellProps {
    track: AlbumTrackData
}

export default function NameCell({ track }: NameCellProps) {
    const classes = useStyles()

    return (
        <MediaViewListCell className={classes.titleColumn} align='left'>
            <span className={classes.title}>{track.mediaId.trackName}</span>
        </MediaViewListCell>
    )
}
