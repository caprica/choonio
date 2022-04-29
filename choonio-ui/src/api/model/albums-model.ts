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

import { AlbumIdentity, TrackIdentity } from './identity-model'
import { RatingType } from './ratings-model'

export interface AlbumData {
    readonly mediaId: AlbumIdentity
    readonly year: number
    readonly genre: string
    readonly duration: number
    readonly tracks: Array<AlbumTrackData>
    readonly rgb: Array<number>
}

export interface AlbumTrackData {
    readonly number: number
    readonly mediaId: TrackIdentity
    readonly artistName: string
    readonly duration: number
    readonly stats?: TrackStats
}

export interface TrackStats {
    readonly listens: number
    readonly rating: RatingType
}
