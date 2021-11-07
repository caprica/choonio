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

import { AlbumTrackData } from '../../../api/model/albums-model'
import TrackNumberCell from '../../views/media-view/cells/TrackNumberCell'
import NameMenuCell from '../../views/media-view/cells/NameMenuCell'
import DurationCell from '../../views/media-view/cells/DurationCell'
import ArtistCell from '../../views/media-view/cells/ArtistCell'
import ListensCell from '../../views/media-view/cells/ListensCell'
import AlbumCell from '../../views/media-view/cells/AlbumCell'
import RatingCell from '../../views/media-view/cells/RatingCell'
import MediaViewListItem from '../../views/media-view/MediaViewListItem'

interface PlaylistItemProps {
    num: number
    track: AlbumTrackData
    onClickMenu: (item: AlbumTrackData, anchorEl: HTMLElement) => void
}

export default function PlaylistItem({ num, track, onClickMenu }: PlaylistItemProps) {
    return (
        <MediaViewListItem>
            <TrackNumberCell num={num} track={track} />
            <NameMenuCell track={track} onClickMenu={onClickMenu} />
            <DurationCell track={track} />
            <ArtistCell track={track} />
            <AlbumCell track={track} />
            <ListensCell track={track} />
            <RatingCell track={track} />
        </MediaViewListItem>
    )
}
