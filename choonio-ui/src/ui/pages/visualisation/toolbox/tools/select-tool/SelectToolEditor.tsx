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

import Select, { ActionMeta } from 'react-select'
import { selectToolStyles } from './select-tool-styles'
import { SelectToolOption } from '../../tool-palettes/options/select-tool-options'
import { useEffect, useState } from 'react'
import { StringToolEditorProps } from '../tool'

interface SelectToolEditorProps extends StringToolEditorProps {
    options: Array<SelectToolOption>
}

export default function SelectToolEditor({ value, options, onChange }: SelectToolEditorProps) {
    const [selectedOption, setSelectedOption] = useState<SelectToolOption | undefined>()

    useEffect(() => {
        setSelectedOption(options.find(option => option.value === value))
    }, [value, options])

    const handleChange = (option: SelectToolOption | null, actionMeta: ActionMeta<SelectToolOption>) => {
        actionMeta
        if (option) onChange(option.value)
    }

    return (
        <Select<SelectToolOption>
            controlShouldRenderValue={true}
            isSearchable={false}
            menuPlacement='auto'
            defaultValue={options[0]}
            value={selectedOption}
            styles={selectToolStyles}
            options={options}
            onChange={handleChange}
        />
    )
}
