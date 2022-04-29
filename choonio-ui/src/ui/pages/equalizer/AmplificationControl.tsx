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
import { Slider } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

const MIN_AMP = -20
const MAX_AMP = 20

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    placeholder: {
        padding: theme.spacing(1)
    },
    slider: {},
    label: {
        marginTop: theme.spacing(2)
    },
    value: {
        marginTop: theme.spacing(1)
    }
}))

interface AmplificationControlProps {
    className?: string
    disabled?: boolean
    label: string
    value: number
    onChange: (value: number) => void
    onChangeCommitted: () => void
}

export default function AmplificationControl({
    className,
    disabled,
    label,
    value,
    onChange,
    onChangeCommitted
}: AmplificationControlProps) {
    const classes = useStyles()

    const handleChange = (_event: Event, newValue: number | number[]) => onChange(newValue as number)

    const handleChangeCommitted = () => onChangeCommitted()

    return (
        <div className={clsx(className, classes.root)}>
            <Slider
                className={classes.slider}
                disabled={disabled}
                orientation='vertical'
                value={value}
                min={MIN_AMP}
                max={MAX_AMP}
                onChange={handleChange}
                onChangeCommitted={handleChangeCommitted}
            />
            <div className={classes.label}>{label}</div>
            <div className={classes.value}>{value.toFixed(1)} dB</div>
        </div>
    )
}
