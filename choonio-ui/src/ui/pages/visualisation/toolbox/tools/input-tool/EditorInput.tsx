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
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

const useStyles = makeStyles({
    root: {
        border: 'none',
        outline: 'none',
        padding: '0',
        backgroundColor: 'unset',
        color: 'white',
        width: '100%',
        height: '100%'
    }
})

interface EditorInputProps {
    value: string
    readOnly?: boolean
    onBeginEditing: () => void
    onEndEditing: () => void
    onChange: (newValue: string) => void
}

export default function EditorInput({ value, readOnly, onBeginEditing, onEndEditing, onChange }: EditorInputProps) {
    const classes = useStyles()

    const [editingValue, setEditingValue] = useState(value)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setEditingValue(event.target.value)

    const handleFocus = () => onBeginEditing()

    const handleBlur = () => {
        if (editingValue !== value) onChange(editingValue)
        onEndEditing()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') onChange(editingValue)
    }

    useEffect(() => {
        setEditingValue(value)
    }, [value])

    return (
        <input
            className={classes.root}
            value={editingValue}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
        />
    )
}
