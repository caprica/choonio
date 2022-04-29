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
import Typography from '@mui/material/Typography'

import { formatDuration } from '../../../lib/duration/duration'
import Genres from '../../components/meta/lists/GenresMetaList'
import { pluralise } from '../../../lib/pluralise/pluralise'
import { AlbumData, AlbumTrackData } from '../../../api/model/albums-model'

const useStyles = makeStyles({
    root: {
        lineHeight: '18px',
        letterSpacing: 'unset',
        marginBottom: 4,
        color: 'rgba(0, 0, 0, 0.54)'
    }
})

interface AlbumMetaProps {
    album: AlbumData
}

export default function AlbumMeta({ album }: AlbumMetaProps) {
    const classes = useStyles()

    const total = album.tracks
        .map((track: AlbumTrackData) => track.duration)
        .reduce((total: number, duration: number) => total + duration, 0)

    return (
        <Typography className={classes.root} variant='body2'>
            {album.year} • {pluralise('track', album.tracks.length)} • {formatDuration(total)} • <Genres value={album.genre} />
        </Typography>
    )
}
