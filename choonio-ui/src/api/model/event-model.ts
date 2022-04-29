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

import { TrackIdentity } from './identity-model'

export enum ApplicationStatus {
    Unknown = 'UNKNOWN',
    Searchmedia = 'SEARCH_MEDIA',
    ExtractMetadata = 'EXTRACT_METADATA',
    GenerateArtwork = 'GENERATE_ARTWORK',
    Ready = 'READY'
}

export interface ApplicationStatusData {
    status: ApplicationStatus
    progress?: number
}

export interface NowPlayingData {
    trackId: TrackIdentity
    queueIndex: number
}

export interface PlayerStateData {
    playing: boolean
    duration: number
    time: number
    position: number
    volume: number
    repeat: RepeatMode
    shuffle: ShuffleMode
    timestamp: number
}

export enum RepeatMode {
    NoRepeat = 'NO_REPEAT',
    RepeatOne = 'REPEAT_ONE',
    RepeatAll = 'REPEAT_ALL'
}

export enum ShuffleMode {
    NoShuffle = 'NO_SHUFFLE',
    Shuffle = 'SHUFFLE'
}

export enum ServerSentEventType {
    StatusChanged = 'STATUS_CHANGED',
    PlayerState = 'PLAYER_STATE',
    NowPlaying = 'NOW_PLAYING',
    PlayerEvent = 'PLAYER_EVENT',
    CollectionChanged = 'COLLECTION_CHANGED'
}

export enum PlayerEventType {
    Playing = 'PLAYING',
    Paused = 'PAUSED',
    Stopped = 'STOPPED',
    Length = 'LENGTH',
    Position = 'POSITION',
    Time = 'TIME',
    Volume = 'VOLUME',
    Mute = 'MUTE',
    Repeat = 'REPEAT',
    Shuffle = 'SHUFFLE'
}

export interface PlayerEvent {
    type: PlayerEventType
    data: any
    timestamp: number
}

export interface CollectionChangedEvent {
    name: CollectionName
    key?: any
}

export enum CollectionName {
    Favourites = 'FAVOURITES',
    Highlights = 'HIGHLIGHTS',
    Playlists = 'PLAYLISTS',
    Plays = 'PLAYS',
    Queue = 'QUEUE',
    Ratings = 'RATINGS',
    Recents = 'RECENTS',
    Configuration = 'CONFIGURATION'
}
