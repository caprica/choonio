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

import { makeStyles } from '@mui/styles'
import { ChangeEvent, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useVisualisationOptions } from '../../../hooks/options/visualisation-options-context'
import { useVisualisationPalettes } from '../../../hooks/palette/visualisation-palettes-context'
import { ColourPalette } from './colour-palette-tool'
import ColourPaletteToolSwatch2 from './ColourPaletteToolSwatch2'

const MAX_PALETTE_SLOTS = 48

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateAreas: '"header header" "picker palette" "actions actions"',
        gap: 16
    },
    header: {
        gridArea: 'header',
        color: 'white',
        display: 'flex'
    },
    picker: {
        gridArea: 'picker'
    },
    palette: {
        gridArea: 'palette',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    swatches: {
        display: 'grid',
        gridTemplateColumns: 'repeat(8, auto)',
        gap: 1
    },
    actions: {
        gridArea: 'actions',
        borderTop: '1px solid #666666',
        paddingTop: 12,
        display: 'flex',
        gap: 12,
        '& > button': {
            width: '6em'
        }
    },
    filler: {
        flexGrow: 1
    }
})

interface ColourPaletteToolPaletteEditorProps {
    palette: ColourPalette
    onClose: () => void
}

interface Slot {
    id: number
    colour?: string
}

export default function ColourPaletteToolPaletteEditor({ palette, onClose }: ColourPaletteToolPaletteEditorProps) {
    const classes = useStyles()

    const [name, setName] = useState(palette.name)
    const [colours, setColours] = useState<Array<string | undefined>>(palette.colours)

    const [pickerValue, setPickerValue] = useState<string | undefined>(palette.colours[0])
    const [activeId, setActiveId] = useState(0)

    const { setPalette, addPalette, deletePalette, updatePalette } = useVisualisationPalettes()
    const { options, setOptions } = useVisualisationOptions()

    const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value)

    const handleClickSwatch = (slot: Slot) => () => {
        setActiveId(slot.id)
        if (slot.colour !== undefined) {
            setPickerValue(slot.colour)
        }
    }

    const handleClearSwatch = (slot: Slot) => () => {
        const newColours = [...colours]
        newColours[slot.id] = undefined
        setColours(newColours)
        setPickerValue(undefined)
    }

    const handleChangePicker = (newValue?: string) => {
        setPickerValue(newValue)
        const newColours = [...colours]
        newColours[activeId] = newValue
        setColours(newColours)
    }

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.currentTarget.value.trim()
        handleChangePicker(newValue.length > 0 ? newValue : undefined)
    }

    const handleClickDelete = () => {
        const palettes = options.palettes.filter((palette: string) => palette !== name)
        setOptions({ ...options, palettes })
        deletePalette(palette.name)
        onClose()
    }

    const handleClickCancel = () => onClose()

    const handleClickOK = () => {
        const newColours: Array<string> = []
        for (let i = 0; i < colours.length; i++) {
            if (colours[i] !== undefined) newColours.push(colours[i] as string)
        }

        const newPalette: ColourPalette = {
            name,
            colours: newColours
        }

        // Preserve the selected state of the current palette if it is renamed
        if (palette.name !== name) {
            const selected = options.palettes.includes(palette.name)
            if (selected) {
                const selectedNames = options.palettes.filter((selectedName: string) => selectedName !== palette.name)
                selectedNames.push(name)
                setOptions({ ...options, palettes: selectedNames })
            }
        }

        updatePalette(palette.name, newPalette)

        onClose()
    }

    const slots: Array<Slot> = []
    for (let i = 0; i < MAX_PALETTE_SLOTS; i++) {
        let slot
        if (i < colours.length) {
            slot = { id: i, colour: colours[i] }
        } else {
            slot = { id: i }
        }
        slots.push(slot)
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <input type='text' value={name} onChange={handleChangeName} style={{ flexGrow: 1 }} />
            </div>
            <HexColorPicker className={classes.picker} color={pickerValue} onChange={handleChangePicker} />
            <div className={classes.palette}>
                <div className={classes.swatches}>
                    {slots.map(slot => (
                        <ColourPaletteToolSwatch2
                            key={slot.id}
                            value={slot.colour}
                            active={slot.id === activeId}
                            onClick={handleClickSwatch(slot)}
                            onDelete={handleClearSwatch(slot)}
                        />
                    ))}
                </div>
                <input type='text' value={pickerValue ? pickerValue.toUpperCase() : ''} onChange={handleChangeInput} />
            </div>
            <div className={classes.actions}>
                <button onClick={handleClickDelete}>Delete</button>
                <span className={classes.filler} />
                <button onClick={handleClickCancel}>Cancel</button>
                <button onClick={handleClickOK}>OK</button>
            </div>
        </div>
    )
}
