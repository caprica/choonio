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

import { ArtSize } from '../../api/model/art-model'
import { albumCoverUrl } from '../../config/service-endpoints'

interface AlbumCoverProps {
    artistName: string
    albumName: string
    size: ArtSize
    className?: string
}

export default function AlbumCover({ artistName, albumName, size, className }: AlbumCoverProps) {
    return (
        <img
            className={className}
            src={albumCoverUrl(artistName, albumName, size)}
            alt={`Cover for ${albumName} by ${artistName}`}
            draggable={false}
        />
    )
}
