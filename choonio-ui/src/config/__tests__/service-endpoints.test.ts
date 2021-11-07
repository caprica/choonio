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

import dayjs from 'dayjs'
import { ArtSize } from '../../api/model/art-model'
import {
    adminUrl,
    albumCoverUrl,
    albumsUrl,
    artistCoverUrl,
    artistsUrl,
    autoPlaylistsNamesUrl,
    autoPlaylistsUrl,
    configurationUrl,
    eventsUrl,
    favouritesUrl,
    genreCoverUrl,
    genresUrl,
    highlightsUrl,
    playerControlsUrl,
    playlistCoverUrl,
    playlistsNamesUrl,
    playlistsUrl,
    queueUrl,
    quickSearchUrl,
    rateTrackUrl,
    recentPlaylistsUrl,
    recentsUrl,
    topAlbumsUrl,
    topArtistsUrl,
    topTracksUrl,
    tracksUrl
} from '../service-endpoints'

describe('Artists endpoints', () => {
    it('returns artists endpoint', () => {
        expect(artistsUrl()).toBe('/api/artists')
    })
})

describe('Albums endpoints', () => {
    it('returns albums for artist endpoint', () => {
        expect(albumsUrl('STRNGR & Destryur')).toBe('/api/albums/STRNGR%20%26%20Destryur')
    })

    it('returns album for endpoint', () => {
        expect(albumsUrl('STRNGR & Destryur', 'Night at the Grindhouse: Part II')).toBe(
            '/api/albums/STRNGR%20%26%20Destryur/Night%20at%20the%20Grindhouse%3A%20Part%20II'
        )
    })
})

describe('Tracks endpoints', () => {
    it('returns tracks endpoint', () => {
        expect(tracksUrl()).toBe('/api/tracks')
    })
})

describe('Playlists endpoints', () => {
    it('returns playlists endpoint', () => {
        expect(playlistsUrl()).toBe('/api/playlists')
    })

    it('returns playlists endpoint', () => {
        expect(playlistsUrl('Only Synthwave')).toBe('/api/playlists/Only%20Synthwave')
    })

    it('returns playlist item endpoint', () => {
        expect(playlistsUrl('Only Synthwave', '12345')).toBe('/api/playlists/Only%20Synthwave/12345')
    })

    it('returns playlist names endpoint', () => {
        expect(playlistsNamesUrl()).toBe('/api/playlists?format=names')
    })
})

describe('Auto playlists endpoints', () => {
    it('returns auto playlists endpoint', () => {
        expect(autoPlaylistsUrl()).toBe('/api/auto-playlists')
    })

    it('returns auto playlist endpoint', () => {
        expect(autoPlaylistsUrl('Thumbs Up')).toBe('/api/auto-playlists/Thumbs%20Up')
    })

    it('returns auto playlist item endpoint', () => {
        expect(autoPlaylistsUrl('Thumbs Up', '12345')).toBe('/api/auto-playlists/Thumbs%20Up/12345')
    })

    it('returns auto playlist names endpoint', () => {
        expect(autoPlaylistsNamesUrl()).toBe('/api/auto-playlists?format=names')
    })
})

describe('Favourites endpoints', () => {
    it('returns favourites endpoint', () => {
        expect(favouritesUrl()).toBe('/api/favourites')
    })

    it('returns favourite endpoint', () => {
        expect(favouritesUrl('12345')).toBe('/api/favourites/12345')
    })
})

describe('Recents endpoints', () => {
    it('returns recents endpoint', () => {
        expect(recentsUrl()).toBe('/api/recent')
    })

    it('returns recent endpoint', () => {
        expect(recentsUrl('12345')).toBe('/api/recent/12345')
    })

    it('returns recent playlists endpoint', () => {
        expect(recentPlaylistsUrl()).toBe('/api/recent?type=PLAYLIST')
    })
})

describe('Highlights endpoints', () => {
    it('returns highlights endpoint', () => {
        expect(highlightsUrl()).toBe('/api/highlights')
    })
})

describe('Genres endpoints', () => {
    it('returns genres endpoint', () => {
        expect(genresUrl()).toBe('/api/genres')
    })

    it('returns genre endpoint', () => {
        expect(genresUrl('Dance/Electronic')).toBe('/api/genres/Dance%2FElectronic')
    })
})

describe('Queue endpoints', () => {
    it('returns queue endpoint', () => {
        expect(queueUrl()).toBe('/api/queue')
    })

    it('returns queue item endpoint', () => {
        expect(queueUrl('12345')).toBe('/api/queue/12345')
    })
})

describe('Search endpoints', () => {
    it('returns quick search endpoint', () => {
        expect(quickSearchUrl('destryur')).toBe('/api/search/quick?q=destryur&limit=100')
    })
})

describe('Art endpoints', () => {
    it('returns artist art URL', () => {
        expect(artistCoverUrl('Power Glove', ArtSize.Smallest)).toBe('/api/artists/Power%20Glove/cover-smallest.jpg')
        expect(artistCoverUrl('Power Glove', ArtSize.Small)).toBe('/api/artists/Power%20Glove/cover-small.jpg')
        expect(artistCoverUrl('Power Glove', ArtSize.Medium)).toBe('/api/artists/Power%20Glove/cover-medium.jpg')
        expect(artistCoverUrl('Power Glove', ArtSize.Large)).toBe('/api/artists/Power%20Glove/cover-large.jpg')
    })

    it('returns album art URL', () => {
        expect(albumCoverUrl('Kalax', 'Not Alone', ArtSize.Smallest)).toBe('/api/albums/Kalax/Not%20Alone/cover-smallest.jpg')
        expect(albumCoverUrl('Kalax', 'Not Alone', ArtSize.Small)).toBe('/api/albums/Kalax/Not%20Alone/cover-small.jpg')
        expect(albumCoverUrl('Kalax', 'Not Alone', ArtSize.Medium)).toBe('/api/albums/Kalax/Not%20Alone/cover-medium.jpg')
        expect(albumCoverUrl('Kalax', 'Not Alone', ArtSize.Large)).toBe('/api/albums/Kalax/Not%20Alone/cover-large.jpg')
    })

    it('returns playlist art URL', () => {
        expect(playlistCoverUrl('Only Synthwave', ArtSize.Smallest)).toBe('/api/playlists/Only%20Synthwave/cover-smallest.jpg')
        expect(playlistCoverUrl('Only Synthwave', ArtSize.Small)).toBe('/api/playlists/Only%20Synthwave/cover-small.jpg')
        expect(playlistCoverUrl('Only Synthwave', ArtSize.Medium)).toBe('/api/playlists/Only%20Synthwave/cover-medium.jpg')
        expect(playlistCoverUrl('Only Synthwave', ArtSize.Large)).toBe('/api/playlists/Only%20Synthwave/cover-large.jpg')
    })

    it('returns genre art URL', () => {
        expect(genreCoverUrl('Dance/Electronic', ArtSize.Smallest)).toBe('/api/genres/Dance%2FElectronic/cover-smallest.jpg')
        expect(genreCoverUrl('Dance/Electronic', ArtSize.Small)).toBe('/api/genres/Dance%2FElectronic/cover-small.jpg')
        expect(genreCoverUrl('Dance/Electronic', ArtSize.Medium)).toBe('/api/genres/Dance%2FElectronic/cover-medium.jpg')
        expect(genreCoverUrl('Dance/Electronic', ArtSize.Large)).toBe('/api/genres/Dance%2FElectronic/cover-large.jpg')
    })
})

describe('Top artists endpoints', () => {
    it('returns top artists endpoint', () => {
        expect(topArtistsUrl(10)).toBe('/api/plays/artists?limit=10')
    })

    it('returns top artists in range endpoint', () => {
        const range = { fromInclusive: dayjs('2021-11-02'), toExclusive: dayjs('2021-11-08') }
        expect(topArtistsUrl(10, range)).toBe('/api/plays/artists?limit=10&from=2021-11-02&to=2021-11-08')
    })
})

describe('Top albums endpoints', () => {
    it('returns top albums endpoint', () => {
        expect(topAlbumsUrl(10)).toBe('/api/plays/albums?limit=10')
    })

    it('returns top albums in range endpoint', () => {
        const range = { fromInclusive: dayjs('2021-11-02'), toExclusive: dayjs('2021-11-08') }
        expect(topAlbumsUrl(10, range)).toBe('/api/plays/albums?limit=10&from=2021-11-02&to=2021-11-08')
    })
})

describe('Top tracks endpoints', () => {
    it('returns top tracks endpoint', () => {
        expect(topTracksUrl(10)).toBe('/api/plays/tracks?limit=10')
    })

    it('returns top tracks in range endpoint', () => {
        const range = { fromInclusive: dayjs('2021-11-02'), toExclusive: dayjs('2021-11-08') }
        expect(topTracksUrl(10, range)).toBe('/api/plays/tracks?limit=10&from=2021-11-02&to=2021-11-08')
    })
})

describe('Admin endpoints', () => {
    it('returns admin endpoint', () => {
        expect(adminUrl('do-the-thing')).toBe('/api/admin/do-the-thing')
    })
})

describe('Player controls endpoints', () => {
    it('returns player controls endpoint', () => {
        expect(playerControlsUrl()).toBe('/api/player/controls')
    })
})

describe('Configuration endpoints', () => {
    it('returns configuration endpoint', () => {
        expect(configurationUrl()).toBe('/api/configuration')
    })
})

describe('Rating endpoints', () => {
    it('returns track rating endpoint', () => {
        expect(rateTrackUrl('STRNGR & Destryur', 'Night at the Grindhouse', 'Corpse Boogie')).toBe(
            '/api/ratings/STRNGR%20%26%20Destryur/Night%20at%20the%20Grindhouse/Corpse%20Boogie'
        )
    })
})

describe('Events endpoints', () => {
    it('returns server-sent-events URL', () => {
        expect(eventsUrl()).toBe('http://localhost:8080/api/events')
    })
})
