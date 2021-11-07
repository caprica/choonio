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
import { MdPlayCircleFilled } from 'react-icons/md'
import { MdPauseCircleFilled } from 'react-icons/md'
import { usePlayerControls } from '../../hooks/player/usePlayerControls'
import { usePlayerState } from '../../hooks/server-sent-events/usePlayerState'

const useStyles = makeStyles(theme => ({
    button: {
        color: theme.palette.primary.main,
        fontSize: '64px',
        '& svg': {
            cursor: 'pointer'
        }
    }
}))

export default function PlayPauseButton() {
    const classes = useStyles()

    const { playing } = usePlayerState()

    const { play, pause } = usePlayerControls()

    if (playing) {
        return (
            <div onClick={pause}>
                <MdPauseCircleFilled className={classes.button} />
            </div>
        )
    } else {
        return (
            <div onClick={play}>
                <MdPlayCircleFilled className={classes.button} />
            </div>
        )
    }
}
