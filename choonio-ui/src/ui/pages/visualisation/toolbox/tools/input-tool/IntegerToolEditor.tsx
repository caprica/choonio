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

import { NumberToolEditorProps } from '../tool'
import EditorInput from './EditorInput'

export default function IntegerToolEditor({ value, onBeginEditing, onEndEditing, onChange }: NumberToolEditorProps) {
    const handleBeginEditing = () => onBeginEditing && onBeginEditing()
    const handleEndEditing = () => onEndEditing && onEndEditing()
    const handleChange = (newValue: string) => {
        const intValue = parseInt(newValue.trim())
        onChange(!isNaN(intValue) ? intValue : 0)
    }

    return (
        <EditorInput
            value={value.toString()}
            onBeginEditing={handleBeginEditing}
            onEndEditing={handleEndEditing}
            onChange={handleChange}
        />
    )
}
