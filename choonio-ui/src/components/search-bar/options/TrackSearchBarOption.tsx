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

import { ArtSize } from '../../../api/model/art-model'
import { TrackIdentity } from '../../../api/model/identity-model'
import AlbumCover from '../../covers/AlbumCover'
import SearchBarOption from './SearchBarOption'

interface TrackSearchBarOptionProps {
    mediaId: TrackIdentity
    onClickPlay: () => void
}

export default function TrackSearchBarOption({ mediaId, onClickPlay }: TrackSearchBarOptionProps) {
    return (
        <SearchBarOption
            cover={<AlbumCover artistName={mediaId.albumArtistName} albumName={mediaId.albumName} size={ArtSize.Small} />}
            primary={mediaId.trackName}
            secondary={`Track from ${mediaId.albumName} by ${mediaId.albumArtistName}`}
            onClickPlay={onClickPlay}
        />
    )
}
