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

import ToolContainer from '../../../toolbox/tool-container/ToolContainer'

import DateToolEditor from './DateToolEditor'

interface DateToolProps {
    caption: string
    value: string
    onChange: (newValue: string) => void
}

export default function DateTool({ caption, value, onChange }: DateToolProps) {
    const handleChange = (newValue: string) => {
        console.log('it changed to ' + newValue)
        onChange(newValue)
        return true
    }

    return <ToolContainer<string> caption={caption} editor={DateToolEditor} value={value} onChange={handleChange} />
}
