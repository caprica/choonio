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

export interface PlayerActionRequest {
    readonly action: PlayerActionType
    readonly data?: PlayerActionRequestData
}

export interface PlayerActionRequestData {
    [key: string]: string
}

export enum PlayerActionType {
    Play = 'PLAY',
    Pause = 'PAUSE',
    SkipNext = 'SKIP_NEXT',
    SkipPrevious = 'SKIP_PREVIOUS',
    Mute = 'MUTE',
    Unmute = 'UNMUTE',
    RepeatNone = 'REPEAT_NONE',
    RepeatOne = 'REPEAT_ONE',
    RepeatAll = 'REPEAT_ALL',
    ShuffleOn = 'SHUFFLE_ON',
    ShuffleOff = 'SHUFFLE_OFF',
    SetPosition = 'SET_POSITION',
    SetVolume = 'SET_VOLUME'
}
