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

import { TrackIdentity } from './identity-model'

export interface RatingData {
    readonly id: string
    readonly mediaId: TrackIdentity
    readonly value: number
    readonly timestamp: number
}

export interface RatingRequest {
    readonly rating: RatingType
}

export enum RatingType {
    Neutral = 'NEUTRAL',
    ThumbsUp = 'THUMBS_UP',
    ThumbsDown = 'THUMBS_DOWN'
}
