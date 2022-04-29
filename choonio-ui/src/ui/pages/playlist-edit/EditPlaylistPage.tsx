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

import { usePlaylistActions } from '../../../hooks/actions/usePlaylistActions'
import PlaylistItems from './PlaylistItems'

import MediaView from '../../../ui/views/media-view/MediaView'

import PlaylistCover from '../../../components/covers/PlaylistCover'
import { ArtSize } from '../../../api/model/art-model'

import PlaylistMeta from '../playlist/PlaylistMeta'
import { useGetPlaylist, useSavePlaylist } from '../../../api/endpoints/playlists-controller'
import { PlaylistItemData, PlaylistRequestItemData, UpdatePlaylistRequestData } from '../../../api/model/playlists-model'
import MediaViewList from '../../views/media-view/MediaViewList'
import { MdAccessTime } from 'react-icons/md'
import { MediaViewListHeader } from '../../views/media-view/MediaViewListHeaders'
import MediaViewHeader from '../../views/media-view/MediaViewHeader'
import invariant from 'tiny-invariant'

const headers: Array<MediaViewListHeader> = [
    { id: 'drag-handle', caption: '', align: 'right' },
    { id: 'name', caption: 'Name' },
    { id: 'duration', icon: <MdAccessTime />, align: 'right' },
    { id: 'artist', caption: 'Artist' },
    { id: 'album', caption: 'Album' },
    { id: 'number', caption: '#', align: 'right' }
]

const toPlaylistRequestItem = (item: PlaylistItemData): PlaylistRequestItemData => ({ trackId: item.track.mediaId })

export default function EditPlaylistPage() {
    const { playlistName } = useParams()
    invariant(playlistName)

    const { playPlaylist } = usePlaylistActions()

    const { data: playlist } = useGetPlaylist(playlistName)

    const savePlaylist = useSavePlaylist()

    if (!playlist) return null

    const artists = playlist.items.map((i: PlaylistItemData) => i.track.mediaId.albumArtistName)

    const handleClickPlay = () => playPlaylist(playlist.mediaId)

    const handleUpdatePlaylist = (items: Array<PlaylistItemData>) => {
        const request: UpdatePlaylistRequestData = { items: items.map(toPlaylistRequestItem) }
        savePlaylist(playlist.mediaId.playlistName, request)
    }

    return (
        <MediaView
            header={
                <MediaViewHeader
                    title={playlistName}
                    description={playlist.description}
                    artists={artists}
                    cover={<PlaylistCover playlistName={playlist.mediaId.playlistName} size={ArtSize.Medium} />}
                    dialogCover={<PlaylistCover playlistName={playlist.mediaId.playlistName} size={ArtSize.Large} />}
                    meta={<PlaylistMeta playlist={playlist} />}
                    // actions={<PlaylistActions playlist={playlist} />}
                    onClickPlay={handleClickPlay}
                />
            }
        >
            <MediaViewList headers={headers}>
                <PlaylistItems playlistItems={playlist.items} onUpdatePlaylist={handleUpdatePlaylist} />
            </MediaViewList>
        </MediaView>
    )
}
