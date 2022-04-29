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
import { CombinedSearchResultsData } from '../../../../../api/model/search-model'
import SearchSummary from '../SearchSummary'

it('renders search summary', () => {
    const searchResults: CombinedSearchResultsData = {
        query: 'neon',
        limit: 10,
        hits: 7,
        artists: {
            hits: 2,
            results: []
        },
        albums: {
            hits: 3,
            results: []
        },
        tracks: {
            hits: 1,
            results: []
        },
        playlists: {
            hits: 0,
            results: []
        }
    }

    render(<SearchSummary results={searchResults} />)
    const text = screen.getByText('Results for "neon"...')
    expect(text).toBeInTheDocument()
})
