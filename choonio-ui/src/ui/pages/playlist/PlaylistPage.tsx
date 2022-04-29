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

import PlaylistCover from '../../../components/covers/PlaylistCover'
import { ArtSize } from '../../../api/model/art-model'

import PlaylistActions from './PlaylistActions'
import PlaylistMeta from './PlaylistMeta'

import { usePlaylistActions } from '../../../hooks/actions/usePlaylistActions'
import { useTrackMenu } from '../../../components/context/menus/track/TrackMenuContext'
import { PlaylistItemData } from '../../../api/model/playlists-model'
import { useGetPlaylist } from '../../../api/endpoints/playlists-controller'
import { AlbumTrackData } from '../../../api/model/albums-model'
import { uniq } from 'lodash'
import MediaView from '../../views/media-view/MediaView'
import { MdAccessTime, MdMusicNote, MdThumbsUpDown } from 'react-icons/md'
import MediaViewList from '../../views/media-view/MediaViewList'
import PlaylistItem from './PlaylistItem'
import { MediaViewListHeader } from '../../views/media-view/MediaViewListHeaders'
import MediaViewHeader from '../../views/media-view/MediaViewHeader'
import invariant from 'tiny-invariant'

const headers: Array<MediaViewListHeader> = [
    { id: 'number', caption: '#', align: 'right' },
    { id: 'name', caption: 'Name' },
    { id: 'duration', icon: <MdAccessTime />, align: 'right' },
    { id: 'artist', caption: 'Artist' },
    { id: 'album', caption: 'Album' },
    { id: 'listens', icon: <MdMusicNote />, align: 'right' },
    { id: 'rating', icon: <MdThumbsUpDown />, align: 'center' }
]

export default function PlaylistPage() {
    const { playlistName } = useParams()
    invariant(playlistName)

    const { playPlaylist } = usePlaylistActions()

    const { openTrackMenu } = useTrackMenu()

    const { data: playlist } = useGetPlaylist(playlistName)

    if (!playlist) return null

    const handleClickPlay = () => playPlaylist(playlist.mediaId)

    const handleClickItemMenu = (item: AlbumTrackData, anchorEl: HTMLElement) => openTrackMenu(item, anchorEl)

    const artists = uniq(playlist.items.map((playlistItem: PlaylistItemData) => playlistItem.track.artistName))

    return (
        <MediaView
            header={
                <MediaViewHeader
                    title={playlist.mediaId.playlistName}
                    description={playlist.description}
                    artists={artists}
                    cover={<PlaylistCover playlistName={playlist.mediaId.playlistName} size={ArtSize.Medium} />}
                    dialogCover={<PlaylistCover playlistName={playlist.mediaId.playlistName} size={ArtSize.Large} />}
                    meta={<PlaylistMeta playlist={playlist} />}
                    actions={<PlaylistActions playlist={playlist} />}
                    onClickPlay={handleClickPlay}
                />
            }
        >
            <MediaViewList headers={headers}>
                {playlist.items.map((item: PlaylistItemData, index: number) => (
                    <PlaylistItem key={item.id} num={index + 1} track={item.track} onClickMenu={handleClickItemMenu} />
                ))}
            </MediaViewList>
        </MediaView>
    )
}
