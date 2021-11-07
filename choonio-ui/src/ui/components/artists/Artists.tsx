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
import Typography from '@mui/material/Typography'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import uniq from 'lodash/uniq'
import { MediaType } from '../../../api/model/identity-model'

const useStyles = makeStyles({
    root: {
        lineHeight: '20px',
        letterSpacing: 'unset',
        marginBottom: 4,
        color: 'rgba(0, 0, 0, 0.54)'
    },
    artist: {
        '&:not(:last-child):after': {
            content: '", "'
        }
    },
    link: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

interface ArtistsProps {
    artists: Array<string>
}

export default function Artists({ artists }: ArtistsProps) {
    const classes = useStyles()

    const { gotoArtist } = useNavigation()

    const handleClickArtist = (artist: string) => () => gotoArtist({ type: MediaType.Artist, artistName: artist })

    const uniqueArtists = uniq(artists)

    return (
        <Typography className={classes.root} variant='body2'>
            {uniqueArtists.map(artist => (
                <span key={artist} className={classes.artist} onClick={handleClickArtist(artist)}>
                    <span className={classes.link}>{artist}</span>
                </span>
            ))}
        </Typography>
    )
}
