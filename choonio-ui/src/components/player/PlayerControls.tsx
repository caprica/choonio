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

import PlayPauseButton from './PlayPauseButton'
import RepeatButton from './RepeatButton'
import ShuffleButton from './ShuffleButton'
import SkipNextButton from './SkipNextButton'
import SkipPreviousButton from './SkipPreviousButton'

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto auto auto',
        columnGap: '32px',
        fontSize: '30px',
        lineHeight: '1rem',
        alignItems: 'center',
        '& div': {
            cursor: 'pointer'
        }
    }
})

export default function PlayerControls() {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <RepeatButton />
            <SkipPreviousButton />
            <PlayPauseButton />
            <SkipNextButton />
            <ShuffleButton />
        </div>
    )
}
