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

import clsx from 'clsx'

import makeStyles from '@mui/styles/makeStyles'

import { formatDuration } from '../../lib/duration/duration'
import { usePlayerState } from '../../hooks/server-sent-events/usePlayerState'

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        top: 0,
        right: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: '12px',
        lineHeight: '12px',
        color: '#757575',
        marginRight: 32,
        marginTop: 2,
        opacity: 0,
        transition: 'opacity .218s ease',
        userSelect: 'none'
    },
    active: {
        opacity: 1
    }
})

interface PlayerTypeProps {
    active: boolean
}

export default function PlayerTime({ active }: PlayerTypeProps) {
    const classes = useStyles()

    const { time, duration } = usePlayerState()

    return (
        <div className={clsx(classes.root, { [classes.active]: active })}>
            {formatDuration(time)} / {formatDuration(duration)}
        </div>
    )
}
