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

import { useParams } from 'react-router-dom'

import makeStyles from '@mui/styles/makeStyles'
import Albums from './Albums'
import ArtistHeading from './ArtistHeading'

import { useArtistActions } from '../../../hooks/actions/useArtistActions'
import { useGetAlbums } from '../../../api/endpoints/albums-controller'
import { artistNameToArtistId, MediaType } from '../../../api/model/identity-model'
import MediaView from '../../views/media-view/MediaView'
import ArtistCover from '../../../components/covers/ArtistCover'
import { ArtSize } from '../../../api/model/art-model'
import ArtistMeta from './ArtistMeta'
import ArtistActions from './ArtistActions'
import MediaViewHeader from '../../views/media-view/MediaViewHeader'
import invariant from 'tiny-invariant'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(8)
    },
    heading: {
        marginTop: 32
    }
}))

export default function ArtistPage() {
    const classes = useStyles()

    const { artistName } = useParams()
    invariant(artistName)

    const { data } = useGetAlbums(artistName)

    const { playArtist } = useArtistActions()

    if (!data?.length) return null

    const handleClickPlayArtist = () => playArtist(artistNameToArtistId(artistName))

    return (
        <MediaView
            header={
                <MediaViewHeader
                    title={artistName}
                    round
                    cover={<ArtistCover artistName={artistName} size={ArtSize.Medium} />}
                    meta={<ArtistMeta albums={data} />}
                    actions={<ArtistActions item={{ type: MediaType.Artist, artistName }} />}
                    onClickPlay={handleClickPlayArtist}
                />
            }
        >
            <ArtistHeading className={classes.heading} caption='Albums' />
            <Albums albums={data} />
        </MediaView>
    )
}
