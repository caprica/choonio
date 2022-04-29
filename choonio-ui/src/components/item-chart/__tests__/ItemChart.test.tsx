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

import { render } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ItemChart from '../ItemChart'

interface TestData {
    value: string
}

const itemRenderer = (item: TestData, rank: number) => (
    <span key={item.value}>
        {rank} {item.value}
        {`\n`}
    </span>
)

describe('item charts', () => {
    it('renders chart items', () => {
        const items: Array<TestData> = [
            {
                value: 'One'
            },
            {
                value: 'Two'
            },
            {
                value: 'Three'
            }
        ]

        const theme = createTheme()

        const { container } = render(
            <ThemeProvider theme={theme}>
                <ItemChart items={items} emptyCaption='Nothing here' renderItem={itemRenderer} filename='the-filename' />
            </ThemeProvider>
        )
        expect(container).toHaveTextContent('1 One 2 Two 3 Three')
    })

    it('renders empty caption when no items', () => {
        const items: Array<TestData> = []

        const theme = createTheme()

        const { container } = render(
            <ThemeProvider theme={theme}>
                <ItemChart items={items} emptyCaption='Nothing here' renderItem={itemRenderer} filename='the-filename' />
            </ThemeProvider>
        )
        expect(container).toHaveTextContent('Nothing here')
    })
})
