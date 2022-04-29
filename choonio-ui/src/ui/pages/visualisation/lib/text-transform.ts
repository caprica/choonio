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

import { toTitleCase } from './title-case'

export enum TextTransformMode {
    UpperCase = 'upper case',
    LowerCase = 'lower case',
    TitleCase = 'title case',
    NoChange = 'no change'
}

export type TextTransformFunction = (value: string) => string

const textTransforms = new Map<TextTransformMode, TextTransformFunction>([
    [TextTransformMode.UpperCase, (value: string) => value.toUpperCase()],
    [TextTransformMode.LowerCase, (value: string) => value.toLowerCase()],
    [TextTransformMode.TitleCase, (value: string) => toTitleCase(value)],
    [TextTransformMode.NoChange, (value: string) => value]
])

export const transformText = (value: string, mode: TextTransformMode) => {
    const fn = textTransforms.get(mode)
    return fn ? fn(value) : value
}
