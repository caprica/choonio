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
import { equalizerBandNames } from './equalizer'
import {
    useEnableEqualizer,
    useGetEqualizerPresets,
    useGetEqualizerState,
    useInvalidateEqualizerState,
    useSetEqualizer
} from '../../../api/endpoints/equalizer-controller'
import AmplificationControl from './AmplificationControl'
import { ChangeEvent, useEffect, useState } from 'react'
import {
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material'
import GroupHeading from '../../components/group/GroupHeading'
import { EqualizerPresetData } from '../../../api/model/equalizer-model'

const zeroBands = () => Array(equalizerBandNames.length).fill(0)

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: theme.spacing(4, 8),
        display: 'flex',
        flexDirection: 'column'
    },
    controls: {
        display: 'flex',
        alignItems: 'center'
    },
    amps: {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 56px)',
        gridTemplateRows: '300px',
        justifyItems: 'center',
        marginTop: theme.spacing(4)
    },
    amp: {},
    divider: {
        margin: 0,
        padding: 0
    }
}))

export default function EqualizerPage() {
    const classes = useStyles()

    const [enable, setEnable] = useState(false)
    const [preset, setPreset] = useState('')
    const [preamp, setPreamp] = useState(0)
    const [bands, setBands] = useState(zeroBands())

    const { data: equalizerState } = useGetEqualizerState()
    const { data: presets } = useGetEqualizerPresets()
    const enableEqualizer = useEnableEqualizer()
    const setEqualizer = useSetEqualizer()
    const invalidateEqualizerState = useInvalidateEqualizerState()

    useEffect(() => {
        if (equalizerState) {
            setEnable(true)
            setPreamp(equalizerState.preamp)
            setBands(equalizerState.bands)
        } else {
            setEnable(false)
            setPreamp(0)
            setBands(zeroBands())
        }
    }, [equalizerState])

    const handleChangeEnable = (event: ChangeEvent<HTMLInputElement>) => {
        const newEnabled = event.target.checked
        setEnable(newEnabled)
        enableEqualizer(newEnabled, () => invalidateEqualizerState())
    }

    const handleChangePreset = (event: SelectChangeEvent) => {
        if (presets) {
            const presetName = event.target.value
            setPreset(presetName)
            const preset = presets.find((p: EqualizerPresetData) => p.name === presetName)
            let newPreamp
            let newBands
            if (preset) {
                newPreamp = preset.preamp
                newBands = [...preset.bands]
            } else {
                newPreamp = 0
                newBands = zeroBands()
            }
            setPreamp(newPreamp)
            setBands(newBands)
            applyEqualizer(newPreamp, newBands)
        }
    }

    const handleChangePreamp = (newValue: number) => setPreamp(newValue)

    const handleChangeCommittedPreamp = () => applyEqualizer(preamp, bands)

    const handleChangeAmp = (index: number) => (newValue: number) => {
        const newValues = [...bands]
        newValues[index] = newValue
        setBands(newValues)
    }

    const handleChangeCommittedAmp = (_index: number) => () => applyEqualizer(preamp, bands)

    const applyEqualizer = (newPreamp: number, newBands: Array<number>) => setEqualizer({ preamp: newPreamp, bands: newBands })

    return (
        <Container className={classes.root} maxWidth='sm'>
            <GroupHeading caption='Audio Equalizer' />
            <Paper className={classes.content}>
                <div className={classes.controls}>
                    <FormControlLabel control={<Checkbox checked={enable} onChange={handleChangeEnable} />} label='Enable' />
                    <InputLabel id='preset-label' style={{ marginLeft: 16 }}>
                        <Typography variant='body1'>Preset</Typography>
                    </InputLabel>
                    <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                        <Select labelId='preset-label' label='PresetX' value={preset} onChange={handleChangePreset}>
                            <MenuItem value=''>None</MenuItem>
                            {presets?.map(preset => (
                                <MenuItem key={preset.name} value={preset.name}>
                                    {preset.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Divider />
                <div className={classes.amps}>
                    <AmplificationControl
                        disabled={!enable}
                        label='Preamp'
                        value={preamp}
                        onChange={handleChangePreamp}
                        onChangeCommitted={handleChangeCommittedPreamp}
                    />
                    <Divider className={classes.divider} orientation='vertical' />
                    {equalizerBandNames.map((band, index) => (
                        <AmplificationControl
                            className={classes.amp}
                            key={band}
                            disabled={!enable}
                            label={band}
                            value={bands[index]}
                            onChange={handleChangeAmp(index)}
                            onChangeCommitted={handleChangeCommittedAmp(index)}
                        />
                    ))}
                </div>
            </Paper>
        </Container>
    )
}
