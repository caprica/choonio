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

import { MediaIdentity } from './identity-model'

export interface AddToQueueRequest {
    readonly mediaId: MediaIdentity
    readonly queueMode: QueueMode
    readonly shuffle?: boolean
}

export enum QueueMode {
    // Play immediately
    Play = 'PLAY',
    // If playing, drop anything queued after the playing item then add to queue, start playing immediately if not playing already
    PlayNext = 'PLAY_NEXT',
    // Add to queue
    Add = 'ADD'
}
