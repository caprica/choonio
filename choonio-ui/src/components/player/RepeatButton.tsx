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

import makeStyles from '@mui/styles/makeStyles'
import { MdRepeat } from 'react-icons/md'
import { MdRepeatOne } from 'react-icons/md'
import { RepeatMode } from '../../api/model/event-model'
import { usePlayerState } from '../../hooks/server-sent-events/usePlayerState'
import { usePlayerControls } from '../../hooks/player/usePlayerControls'

const useStyles = makeStyles({
    active: {
        color: 'orangered'
    }
})

export default function RepeatButton() {
    const classes = useStyles()

    const { repeat } = usePlayerState()

    const { repeatNone, repeatOne, repeatAll } = usePlayerControls()

    switch (repeat) {
        case RepeatMode.NoRepeat:
            return (
                <div onClick={repeatAll}>
                    <MdRepeat />
                </div>
            )
        case RepeatMode.RepeatAll:
            return (
                <div onClick={repeatOne}>
                    <MdRepeat className={classes.active} />
                </div>
            )
        case RepeatMode.RepeatOne:
            return (
                <div onClick={repeatNone}>
                    <MdRepeatOne className={classes.active} />
                </div>
            )
    }
}
