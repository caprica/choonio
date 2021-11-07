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

import makeStyles from '@mui/styles/makeStyles'
import { MdShuffle } from 'react-icons/md'
import { ShuffleMode } from '../../api/model/event-model'
import { usePlayerState } from '../../hooks/server-sent-events/usePlayerState'
import { usePlayerControls } from '../../hooks/player/usePlayerControls'

const useStyles = makeStyles({
    active: {
        color: 'orangered'
    }
})

export default function ShuffleButton() {
    const classes = useStyles()

    const { shuffle } = usePlayerState()

    const { shuffleOn, shuffleOff } = usePlayerControls()

    switch (shuffle) {
        case ShuffleMode.NoShuffle:
            return (
                <div onClick={shuffleOn}>
                    <MdShuffle />
                </div>
            )
        case ShuffleMode.Shuffle:
            return (
                <div onClick={shuffleOff}>
                    <MdShuffle className={classes.active} />
                </div>
            )
    }
}
