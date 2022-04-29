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

import { pluralise } from '../../../../lib/pluralise/pluralise'

import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import { TrackPlaysData } from '../../../../api/model/plays-model'
import { trackIdToAlbumId, trackIdToArtistId } from '../../../../api/model/identity-model'

const useStyles = makeStyles({
    root: {
        //        lineHeight: '18px',
        lineHeight: '20px',
        letterSpacing: 'unset',
        marginBottom: 4,
        color: 'rgba(0, 0, 0, 0.54)'
    },
    link: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

interface TrackListensMetaProps {
    item: TrackPlaysData
}

export default function TrackListensMeta({ item }: TrackListensMetaProps) {
    const classes = useStyles()

    const { gotoArtist, gotoAlbum } = useNavigation()

    const handleClickArtist = () => gotoArtist(trackIdToArtistId(item.mediaId))
    const handleClickAlbum = () => gotoAlbum(trackIdToAlbumId(item.mediaId))

    return (
        <Typography className={classes.root} variant='body2'>
            from{' '}
            <span className={classes.link} onClick={handleClickAlbum}>
                {item.mediaId.albumName}
            </span>{' '}
            by{' '}
            <span className={classes.link} onClick={handleClickArtist}>
                {item.mediaId.albumArtistName}
            </span>{' '}
            • {pluralise('listen', item.listens)}
        </Typography>
    )
}
