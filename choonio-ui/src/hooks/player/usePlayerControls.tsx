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

import { usePostPlayerAction } from '../../api/endpoints/player-controller'
import { PlayerActionType } from '../../api/model/player-model'

export const usePlayerControls = () => {
    const postPlayerAction = usePostPlayerAction()

    const play = () => postPlayerAction({ action: PlayerActionType.Play })
    const pause = () => postPlayerAction({ action: PlayerActionType.Pause })
    const skipNext = () => postPlayerAction({ action: PlayerActionType.SkipNext })
    const skipPrevious = () => postPlayerAction({ action: PlayerActionType.SkipPrevious })
    const mute = () => postPlayerAction({ action: PlayerActionType.Mute })
    const unmute = () => postPlayerAction({ action: PlayerActionType.Unmute })
    const repeatNone = () => postPlayerAction({ action: PlayerActionType.RepeatNone })
    const repeatOne = () => postPlayerAction({ action: PlayerActionType.RepeatOne })
    const repeatAll = () => postPlayerAction({ action: PlayerActionType.RepeatAll })
    const shuffleOn = () => postPlayerAction({ action: PlayerActionType.ShuffleOn })
    const shuffleOff = () => postPlayerAction({ action: PlayerActionType.ShuffleOff })

    const setPosition = (position: number) => {
        postPlayerAction({ action: PlayerActionType.SetPosition, data: { position: position.toString() } })
    }

    const setVolume = (volume: number) => {
        postPlayerAction({ action: PlayerActionType.SetVolume, data: { volume: volume.toString() } })
    }

    return {
        play,
        pause,
        skipNext,
        skipPrevious,
        mute,
        unmute,
        repeatNone,
        repeatOne,
        repeatAll,
        shuffleOn,
        shuffleOff,
        setPosition,
        setVolume
    }
}
