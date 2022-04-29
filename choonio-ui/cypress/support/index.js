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

// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
    cy.intercept('GET', '/api/favourites', { fixture: 'json/favourites.json' })
    cy.intercept('GET', '/api/highlights', { fixture: 'json/highlights.json' })
    cy.intercept('GET', '/api/playlists', { fixture: 'json/playlists.json' })
    cy.intercept('GET', '/api/playlists?format=names', { fixture: 'json/playlist-names.json' })
    cy.intercept('GET', '/api/recent', { fixture: 'json/recents.json' })
    cy.intercept('GET', '/api/recent?type=PLAYLIST', { fixture: 'json/recent-playlists.json' })

    cy.intercept('GET', '/api/artists/*/cover-smallest.jpg', { fixture: 'images/artist/artist-cover-smallest.jpg' })
    cy.intercept('GET', '/api/artists/*/cover-small.jpg', { fixture: 'images/artist/artist-cover-small.jpg' })
    cy.intercept('GET', '/api/artists/*/cover-medium.jpg', { fixture: 'images/artist/artist-cover-medium.jpg' })
    cy.intercept('GET', '/api/artists/*/cover-large.jpg', { fixture: 'images/artist/artist-cover-large.jpg' })

    cy.intercept('GET', '/api/albums/*/*/cover-smallest.jpg', { fixture: 'images/album/album-cover-smallest.jpg' })
    cy.intercept('GET', '/api/albums/*/*/cover-small.jpg', { fixture: 'images/album/album-cover-small.jpg' })
    cy.intercept('GET', '/api/albums/*/*/cover-medium.jpg', { fixture: 'images/album/album-cover-medium.jpg' })
    cy.intercept('GET', '/api/albums/*/*/cover-large.jpg', { fixture: 'images/album/album-cover-large.jpg' })

    cy.intercept('GET', '/api/playlists/*/cover-smallest.jpg', { fixture: 'images/playlist/playlist-cover-smallest.jpg' })
    cy.intercept('GET', '/api/playlists/*/cover-small.jpg', { fixture: 'images/playlist/playlist-cover-small.jpg' })
    cy.intercept('GET', '/api/playlists/*/cover-medium.jpg', { fixture: 'images/playlist/playlist-cover-medium.jpg' })
    cy.intercept('GET', '/api/playlists/*/cover-large.jpg', { fixture: 'images/playlist/playlist-cover-large.jpg' })
})
