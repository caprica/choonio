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

import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import MediaViewListCell from '../MediaViewListCell'
import { AlbumTrackData } from '../../../../api/model/albums-model'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import { MediaType } from '../../../../api/model/identity-model'

const useStyles = makeStyles({
    title: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    link: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

interface ArtistCellProps {
    track: AlbumTrackData
}

export default function ArtistCell({ track }: ArtistCellProps) {
    const classes = useStyles()

    const { gotoArtist } = useNavigation()

    const handleClick = () => gotoArtist({ type: MediaType.Artist, artistName: track.artistName })

    return (
        <MediaViewListCell>
            <span className={clsx(classes.title, classes.link)} onClick={handleClick}>
                {track.artistName}
            </span>
        </MediaViewListCell>
    )
}
