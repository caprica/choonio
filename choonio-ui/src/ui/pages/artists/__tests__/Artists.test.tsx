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
import { BrowserRouter as Router } from 'react-router-dom'
import { ArtistData } from '../../../../api/model/artists-model'
import { MediaType } from '../../../../api/model/identity-model'
import Artists from '../Artists'

// FIXME this renders a CoverImage we need to somehow stub that?

it('Renders artists', () => {
    const artists: Array<ArtistData> = [
        {
            mediaId: {
                type: MediaType.Artist,
                artistName: 'Neon Nox'
            },
            albums: 2,
            tracks: 21,
            duration: 5197
        }
    ]

    render(
        <Router>
            <Artists artists={artists} />
        </Router>
    )
    const text = screen.getByText('Neon Nox')
    expect(text).toBeInTheDocument()
})
