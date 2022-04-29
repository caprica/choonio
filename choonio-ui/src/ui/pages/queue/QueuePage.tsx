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

import { useTrackMenu } from '../../../components/context/menus/track/TrackMenuContext'
import { PlaylistItemData } from '../../../api/model/playlists-model'
import { AlbumTrackData } from '../../../api/model/albums-model'
import MediaView from '../../views/media-view/MediaView'
import { MdAccessTime, MdMusicNote, MdThumbsUpDown } from 'react-icons/md'
import MediaViewList from '../../views/media-view/MediaViewList'
import { MediaViewListHeader } from '../../views/media-view/MediaViewListHeaders'
import { useGetQueue } from '../../../api/endpoints/queue-controller'
import PlaylistItem from '../playlist/PlaylistItem'
import QueueBanner from './QueueBanner'
import EmptyQueue from './EmptyQueue'

const headers: Array<MediaViewListHeader> = [
    { id: 'number', caption: '#', align: 'right' },
    { id: 'name', caption: 'Name' },
    { id: 'duration', icon: <MdAccessTime />, align: 'right' },
    { id: 'artist', caption: 'Artist' },
    { id: 'album', caption: 'Album' },
    { id: 'listens', icon: <MdMusicNote />, align: 'right' },
    { id: 'rating', icon: <MdThumbsUpDown />, align: 'center' }
]

export default function QueuePage() {
    const { openTrackMenu } = useTrackMenu()

    const { data: queue } = useGetQueue()

    const handleClickItemMenu = (item: AlbumTrackData, anchorEl: HTMLElement) => openTrackMenu(item, anchorEl)

    if (queue) {
        return (
            <MediaView header={<QueueBanner queue={queue} />}>
                <MediaViewList headers={headers}>
                    {queue.items.map((item: PlaylistItemData, index: number) => (
                        <PlaylistItem key={item.id} num={index + 1} track={item.track} onClickMenu={handleClickItemMenu} />
                    ))}
                </MediaViewList>
            </MediaView>
        )
    } else {
        return <EmptyQueue />
    }
}
