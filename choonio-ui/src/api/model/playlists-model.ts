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

import { AlbumTrackData } from './albums-model'
import { MediaIdentity, PlaylistIdentity, TrackIdentity } from './identity-model';

export interface PlaylistName {
    readonly id: string
    readonly mediaId: PlaylistIdentity
    readonly created: string
    readonly modified: string
}

export interface PlaylistData {
    readonly id: string
    readonly mediaId: PlaylistIdentity
    readonly description: string
    readonly items: Array<PlaylistItemData>
    readonly duration: number
    readonly created: string
    readonly updated: string
}

export interface PlaylistItemData {
    readonly id: string
    readonly track: AlbumTrackData
}

export interface AddToPlaylistRequest {
    readonly mediaId: MediaIdentity
}

export interface UpdatePlaylistRequestData {
    readonly items: Array<PlaylistRequestItemData>
}

export interface PlaylistRequestItemData {
    readonly trackId: TrackIdentity
}
