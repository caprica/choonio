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

import { render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import RangeFooter from '../RangeFooter'

it('renders from and to when date range spans multiple days', () => {
    const dateRange = {
        fromInclusive: dayjs('2021-09-01'),
        toExclusive: dayjs('2021-09-08')
    }
    render(<RangeFooter dateRange={dateRange} />)
    const text = screen.getByText('from 2021-09-01 to 2021-09-07 inclusive')
    expect(text).toBeInTheDocument()
})

it('renders single date when date range spans a single day', () => {
    const dateRange = {
        fromInclusive: dayjs('2021-09-15'),
        toExclusive: dayjs('2021-09-16')
    }
    render(<RangeFooter dateRange={dateRange} />)
    const text = screen.getByText('on 2021-09-15')
    expect(text).toBeInTheDocument()
})

it('renders "all time" when no date range specified', () => {
    render(<RangeFooter />)
    const text = screen.getByText('all time')
    expect(text).toBeInTheDocument()
})
