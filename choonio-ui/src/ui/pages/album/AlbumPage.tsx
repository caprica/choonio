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

import { useParams } from 'react-router-dom'

import AlbumCover from '../../../components/covers/AlbumCover'
import { ArtSize } from '../../../api/model/art-model'

import AlbumMeta from './AlbumMeta'
import AlbumActions from './AlbumActions'
import { useAlbumActions } from '../../../hooks/actions/useAlbumActions'
import { useTrackMenu } from '../../../components/context/menus/track/TrackMenuContext'
import { useGetAlbum } from '../../../api/endpoints/albums-controller'
import { AlbumTrackData } from '../../../api/model/albums-model'
import { AlbumIdentity, MediaType } from '../../../api/model/identity-model'
import MediaView from '../../views/media-view/MediaView'
import MediaViewList from '../../views/media-view/MediaViewList'
import { uniq } from 'lodash'
import { MediaViewListHeader } from '../../views/media-view/MediaViewListHeaders'
import { MdAccessTime, MdMusicNote, MdThumbsUpDown } from 'react-icons/md'
import AlbumItem from './AlbumItem'
import MediaViewHeader from '../../views/media-view/MediaViewHeader'
import invariant from 'tiny-invariant'

const headers: Array<MediaViewListHeader> = [
    { id: 'number', caption: '#', align: 'right' },
    { id: 'name', caption: 'Name' },
    { id: 'duration', icon: <MdAccessTime />, align: 'right' },
    { id: 'listens', icon: <MdMusicNote />, align: 'right' },
    { id: 'rating', icon: <MdThumbsUpDown />, align: 'center' }
]

const artistHeaders: Array<MediaViewListHeader> = [
    { id: 'number', caption: '#', align: 'right' },
    { id: 'name', caption: 'Name' },
    { id: 'duration', icon: <MdAccessTime />, align: 'right' },
    { id: 'artist', caption: 'Artist' },
    { id: 'listens', icon: <MdMusicNote />, align: 'right' },
    { id: 'rating', icon: <MdThumbsUpDown />, align: 'center' }
]

export default function AlbumPage() {
    const { artistName, albumName } = useParams()
    invariant(artistName)
    invariant(albumName)

    const { data } = useGetAlbum(artistName, albumName)

    const { playAlbum } = useAlbumActions()
    const { openTrackMenu } = useTrackMenu()

    if (!data) return null

    const albumId: AlbumIdentity = { type: MediaType.Album, albumArtistName: artistName, albumName }

    const handleClickPlay = () => playAlbum(albumId)

    const handleClickItemMenu = (item: AlbumTrackData, anchorEl: HTMLElement) => openTrackMenu(item, anchorEl)

    const showArtist = uniq(data.tracks.map((track: AlbumTrackData) => track.artistName)).length > 1

    return (
        <MediaView
            header={
                <MediaViewHeader
                    title={data.mediaId.albumName}
                    artists={[data.mediaId.albumArtistName]}
                    cover={
                        <AlbumCover
                            artistName={data.mediaId.albumArtistName}
                            albumName={data.mediaId.albumName}
                            size={ArtSize.Medium}
                        />
                    }
                    dialogCover={
                        <AlbumCover
                            artistName={data.mediaId.albumArtistName}
                            albumName={data.mediaId.albumName}
                            size={ArtSize.Large}
                        />
                    }
                    meta={<AlbumMeta album={data} />}
                    actions={<AlbumActions album={data} />}
                    onClickPlay={handleClickPlay}
                />
            }
        >
            <MediaViewList headers={!showArtist ? headers : artistHeaders}>
                {data.tracks.map((item: AlbumTrackData) => (
                    <AlbumItem key={item.number} track={item} onClickMenu={handleClickItemMenu} showArtist={showArtist} />
                ))}
            </MediaViewList>
        </MediaView>
    )
}
