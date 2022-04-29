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

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import throttle from 'lodash/throttle'

import { Slider } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MdVolumeDown, MdVolumeUp } from 'react-icons/md'
import { usePlayerControls } from '../../hooks/player/usePlayerControls'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        columnGap: 16,
        fontSize: '24px',
        alignItems: 'center',
        marginRight: '16px'
    },
    fade: {
        display: 'flex',
        flexWrap: 'nowrap',
        columnGap: 16,
        fontSize: '24px',
        alignItems: 'center',
        transition: 'opacity .218s ease-in',
        opacity: 0
    },
    permanent: {
        display: 'flex',
        flexWrap: 'nowrap',
        fontSize: '24px',
        alignItems: 'center'
    },
    active: {
        opacity: 1
    },
    slider: {
        width: '108px'
    },
    container: {
        color: theme.palette.primary.main
    },
    rail: {
        height: '1px',
        color: '#bdbdbd'
    },
    track: {
        height: 0
    },
    thumb: {
        height: '12px',
        width: '12px'
    }
}))

interface VolumeControlsProps {
    className?: string
    volume: number
}

/**
 * Volume controls.
 *
 * When using the slider to set the volume, we do not want to process any incoming volume state change events as this would cause
 * visual glitches in the slider as the value set by the user dragging the slider fights against the different values coming in
 * from the player state events.
 *
 * This has a number of implications for the implementation:
 *
 *   1. The value of the slider must be set indirectly, the "value" state is used for this, rather than using the "volume" state
 *      passed in;
 *   2. We must track if the slider is currently being adjusted (i.e. is is being dragged to and fro). This is achieved by setting
 *      the "volumeChanging" state to true on a slider change event, and only setting it back to false when the slider generates a
 *      change committed event;
 *   3. We track the incoming volume state updates in an effect, and only set the new volume value if the volme changing state is
 *      false.
 *
 * There are further nuances...
 *
 * We apply a scale factor to the volume value range, the aim of this is to give smoother action on the slider. Ordinarily the
 * values will range from 0 to 100, but since the slider is wider than 100 pixels when dragging the thumb it does not always feel
 * smooth.
 *
 * Finally, the volume change is effected buy invoking a web service. We do not want to swamp the web service with continuous API
 * calls as the slider is being dragged, but we do want the volume changes to be reasonably responsive so a throttle is applied
 * to the web service call thereby to implement rate-limiting.
 *
 * This is not perfect, but is good enough for now.
 *
 * @param {*} volume
 */
export default function VolmeControls({ className, volume }: VolumeControlsProps) {
    // 0..100 -> 0..1000
    const SCALE = 10
    const THROTTLE = 500

    const classes = useStyles()
    const [active, setActive] = useState(false)

    const [volumeChanging, setVolumeChanging] = useState(false)
    const [value, setValue] = useState(volume * SCALE)

    const { setVolume } = usePlayerControls()

    const handleMouseEnter = () => setActive(true)
    const handleMouseLeave = () => setActive(false)

    const callWebService = throttle(value => setVolume(Math.round(value / SCALE)), THROTTLE)

    // (event: React.ChangeEvent<{}>, value: number | number[])
    const handleVolumeChange = (_: any, value: any) => {
        setVolumeChanging(true)
        setValue(value)
        callWebService(value)
    }

    const handleVolumeChangeCommitted = () => setVolumeChanging(false)

    useEffect(() => {
        if (!volumeChanging) setValue(volume * SCALE)
    }, [volumeChanging, volume])

    return (
        <div
            className={clsx(className, classes.root, { [classes.active]: active || volumeChanging })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={clsx(classes.fade, { [classes.active]: active || volumeChanging })}>
                <MdVolumeDown className={clsx({ [classes.active]: active })} />
                <Slider
                    className={classes.slider}
                    classes={{ root: classes.container, rail: classes.rail, track: classes.track, thumb: classes.thumb }}
                    min={0}
                    max={100 * SCALE}
                    value={value}
                    onChange={handleVolumeChange}
                    onChangeCommitted={handleVolumeChangeCommitted}
                    aria-labelledby='volume-slider'
                />
            </div>
            <div className={classes.permanent}>
                <MdVolumeUp />
            </div>
        </div>
    )
}
