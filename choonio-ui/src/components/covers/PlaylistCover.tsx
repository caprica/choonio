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

import { ArtSize } from '../../api/model/art-model'
import { playlistCoverUrl } from '../../config/service-endpoints'

interface PlaylistCoverProps {
    playlistName: string
    size: ArtSize
    className?: string
}

export default function PlaylistCover({ playlistName, size, className }: PlaylistCoverProps) {
    return (
        <img
            className={className}
            src={playlistCoverUrl(playlistName, size)}
            alt={`Cover for ${playlistName}`}
            draggable={false}
        />
    )
}
