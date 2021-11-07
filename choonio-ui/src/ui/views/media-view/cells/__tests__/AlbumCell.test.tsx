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

import { render } from '@testing-library/react'
import { AlbumTrackData } from '../../../../../api/model/albums-model'
import { MediaType } from '../../../../../api/model/identity-model'
import { RatingType } from '../../../../../api/model/ratings-model'
import AlbumCell from '../AlbumCell'

it('renders track name', () => {
    const track: AlbumTrackData = {
        number: 7,
        mediaId: {
            type: MediaType.Track,
            albumArtistName: 'STRNGR & Destryur',
            albumName: 'Night at the Grindhouse: Part II',
            trackName: 'Flight of Fear'
        },
        artistName: 'STRNGR & Destryur',
        duration: 267,
        stats: {
            listens: 14,
            rating: RatingType.ThumbsUp
        }
    }

    const tr = document.createElement('tr')
    const { container } = render(<AlbumCell track={track} />, {
        container: document.body.appendChild(tr)
    })
    expect(container).toHaveTextContent('Night at the Grindhouse: Part II')
})
