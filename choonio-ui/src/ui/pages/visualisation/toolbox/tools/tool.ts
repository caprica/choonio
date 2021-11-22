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

export interface ToolProps<T> {
    caption?: string
    value: T
    onChange: (newValue: T) => void
}

export interface StringToolProps extends ToolProps<string> {
    minLength?: number
    maxLength?: number
    required?: boolean
}

export interface NumberToolProps extends ToolProps<number> {
    min?: number
    max?: number
}

export type BooleanToolProps = ToolProps<boolean>

export interface ToolEditorProps<T> {
    value: T
    onBeginEditing?: () => void
    onEndEditing?: () => void
    onChange: (newValue: T) => void
}

export type StringToolEditorProps = ToolEditorProps<string>

export type NumberToolEditorProps = ToolEditorProps<number>

export type BooleanToolEditorProps = ToolEditorProps<boolean>
