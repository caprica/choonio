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

import clsx from 'clsx'

import makeStyles from '@mui/styles/makeStyles'
import { MdThumbDown } from 'react-icons/md'
import { MdThumbUp } from 'react-icons/md'
import { RatingType } from '../../../../api/model/ratings-model'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        columnGap: '12px',
        justifyContent: 'center'
    },
    active: {
        opacity: '1!important',
        '& svg': {
            fill: '#212121'
        }
    },
    icon: {
        fontSize: '22px',
        lineHeight: '22px',
        color: '#616161',
        verticalAlign: 'middle',
        opacity: 0
    },
    selected: {
        opacity: 1
    }
})

interface RatingProps {
    value: RatingType
    active?: boolean
    onClickThumbsUp: () => void
    onClickThumbsDown: () => void
}

export default function Rating({ value, active, onClickThumbsUp, onClickThumbsDown }: RatingProps) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <span
                className={clsx(classes.icon, { [classes.active]: active, [classes.selected]: value === RatingType.ThumbsUp })}
                onClick={onClickThumbsUp}
            >
                <MdThumbUp />
            </span>
            <span
                className={clsx(classes.icon, { [classes.active]: active, [classes.selected]: value === RatingType.ThumbsDown })}
                onClick={onClickThumbsDown}
            >
                <MdThumbDown />
            </span>
        </div>
    )
}
