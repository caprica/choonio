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

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import throttle from 'lodash/throttle'

import makeStyles from '@mui/styles/makeStyles'
import Slider from '@mui/material/Slider'
import { usePlayerState } from '../../hooks/server-sent-events/usePlayerState'
import { usePlayerControls } from '../../hooks/player/usePlayerControls'

const useStyles = makeStyles(theme => ({
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
        color: theme.palette.primary.main,
        width: 'calc(100% - 8px)' // this is a bit of a hack because of the scrolling at 99.5%+ GPM doesn't do this, the thumb is shown half off the screen, not sure it's worth making the same here - it seems ok at the LHS when zero, don't get it
    },
    rail: {
        height: '4px',
        color: 'white'
    },
    track: {
        height: '2px'
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
}))

interface PositionControlsProps {
    className?: string
    timestamp: number
}

export default function PositionControls({ className, timestamp }: PositionControlsProps) {
    // 0..1 -> 0 -> 1000
    const SCALE = 1000.0
    const THROTTLE = 500

    const { position } = usePlayerState()

    const { setPosition } = usePlayerControls()

    if (timestamp == 0) console.log(timestamp)

    const classes = useStyles()

    const [active, setActive] = useState(false)

    const [positionChanging, setPositionChanging] = useState(false)
    const [value, setValue] = useState(position * SCALE)

    const [myTimestamp, setMyTimestamp] = useState(0)

    // const handleMouseEnter = () => setActive(true)
    // const handleMouseLeave = () => setActive(false)

    const callWebService = throttle(value => setPosition(value / SCALE), THROTTLE)

    const handlePositionChange = (_: any, value: any) => {
        setPositionChanging(true)
        setMyTimestamp(Date.now())
        setValue(value)
        callWebService(value)
    }

    const handlePositionChangeCommitted = () => {
        setPositionChanging(false)
        setMyTimestamp(Date.now())
    }

    useEffect(() => {
        if (!positionChanging && timestamp > myTimestamp) setValue(position * SCALE)
        // if (!positionChanging) setValue(position * SCALE)
    }, [positionChanging, position, myTimestamp, timestamp])

    return (
        <Slider
            className={clsx(className, classes.slider)}
            classes={{
                root: classes.container,
                rail: clsx(classes.rail, { [classes.active]: active }),
                track: classes.track,
                thumb: classes.thumb
            }}
            min={0}
            max={1 * SCALE}
            value={value}
            onChange={handlePositionChange}
            onChangeCommitted={handlePositionChangeCommitted}
            aria-labelledby='playback-position-slider'
        />
    )
}
