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

import map from 'lodash/map'
import uniqBy from 'lodash/uniqBy'

import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'

import { formatDuration } from '../../../lib/duration/duration'
import Genres from '../../components/meta/lists/GenresMetaList'
import { pluralise } from '../../../lib/pluralise/pluralise'
import { AlbumData } from '../../../api/model/albums-model'

const useStyles = makeStyles({
    root: {
        //        lineHeight: '18px',
        lineHeight: '20px',
        letterSpacing: 'unset',
        marginBottom: 4,
        color: 'rgba(0, 0, 0, 0.54)'
    }
})

interface ArtistMetaProps {
    albums: Array<AlbumData>
}

export default function ArtistMeta({ albums }: ArtistMetaProps) {
    const classes = useStyles()

    const total = albums.map(album => album.duration).reduce((total, duration) => total + duration, 0)

    const genres = map(uniqBy(albums, 'genre'), 'genre')

    return (
        <Typography className={classes.root} variant='body2'>
            {pluralise('album', albums.length)} • {formatDuration(total)} • <Genres value={genres} />
        </Typography>
    )
}
