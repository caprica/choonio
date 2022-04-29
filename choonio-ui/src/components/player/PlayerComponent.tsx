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

import { useState } from 'react'

import { IconButton } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

import NowPlaying from './NowPlaying'
import PlayerControls from './PlayerControls'
import PlayerTime from './PlayerTime'

import PositionControls from './PositionControls'
import VolmeControls from './VolumeControls'
import { MdCast, MdOpenInNew, MdQueueMusic } from 'react-icons/md'
import { usePlayerState } from '../../hooks/server-sent-events/usePlayerState'
import { useNavigation } from '../../hooks/navigation/useNavigation'

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    slider: {
        gridColumn: '1/4'
    },
    container: {
        position: 'absolute',
        top: '-14px',
        // left: '6px',
        height: '4px',
        color: 'orangered',
        width: 'calc(100% - 8px)' // this is a bit of a hack because of the scrolling at 99.5%+ GPM doesn't do this, the thumb is shown half off the screen, not sure it's worth making the same here - it seems ok at the LHS when zero, don't get it
    },
    rail: {
        height: '4px',
        color: 'white'
    },
    track: {
        height: '4px'
    },
    thumb: {
        width: '14px',
        height: '14px',
        overflow: 'hidden'
    },
    right: {
        justifySelf: 'end'
    },
    icons: {
        display: 'flex',
        flexWrap: 'nowrap',
        columnGap: 8,
        fontSize: '24px',
        marginRight: '32px'
    },
    icon: {
        color: '#212121',
        padding: 8
    },
    active: {
        color: '#e6e6e6',
        opacity: 1
    }
})

export default function PlayerComponent() {
    const classes = useStyles()

    const [active, setActive] = useState(false)

    const playerState = usePlayerState()

    const { gotoQueue } = useNavigation()

    const handleMouseEnter = () => setActive(true)
    const handleMouseLeave = () => setActive(false)

    return (
        <div className={classes.root} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <PositionControls className={classes.slider} timestamp={playerState.timestamp} />
            <NowPlaying />
            <PlayerControls />
            <div className={classes.right}>
                <PlayerTime active={active} />
                <span className={classes.icons}>
                    <VolmeControls volume={playerState.volume} />
                    <IconButton className={classes.icon} size='medium'>
                        <MdCast />
                    </IconButton>
                    <IconButton className={classes.icon} onClick={gotoQueue} size='medium'>
                        <MdQueueMusic />
                    </IconButton>
                    <IconButton className={classes.icon} size='medium'>
                        <MdOpenInNew />
                    </IconButton>
                </span>
            </div>
        </div>
    )
}
