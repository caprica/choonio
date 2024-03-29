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

import { AlbumIdentity, ArtistIdentity, TrackIdentity } from './identity-model'

export interface PlayData {
    readonly id: string
    readonly mediaId: TrackIdentity
    readonly timestamp: number
}

export interface ArtistPlaysData {
    readonly mediaId: ArtistIdentity
    readonly listens: number
}

export interface AlbumPlaysData {
    readonly mediaId: AlbumIdentity
    readonly listens: number
}

export interface TrackPlaysData {
    readonly mediaId: TrackIdentity
    readonly listens: number
}
