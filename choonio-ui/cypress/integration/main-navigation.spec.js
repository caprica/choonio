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

describe('Main Navigation', () => {
    it('Clicking "Music library" in the navigation area navigates to the Artists page', () => {
        cy.visit('/')
        cy.get('nav').contains('Music library').click()
        cy.url().should('include', '/artists')
    })

    it('Clicking "Recent" in the navigation area navigates to the Recents page', () => {
        cy.visit('/')
        cy.get('nav').contains('Recent').click()
        cy.url().should('include', '/recent')
    })

    it('Clicking "Favourites" in the navigation area navigates to the Favourites page', () => {
        cy.visit('/')
        cy.get('nav').contains('Favourites').click()
        cy.url().should('include', '/favourites')
    })

    it('Clicking "Playlists" in the navigation area navigates to the Playlists page', () => {
        cy.visit('/')
        cy.get('nav').contains('Playlists').click()
        cy.url().should('include', '/playlists')
    })

    it('Clicking "Top charts" in the navigation area navigates to the Stats page', () => {
        cy.visit('/')
        cy.get('nav').contains('Top charts').click()
        cy.url().should('include', '/stats')
    })

    it('Clicking Navigation drawer button opens Navigation drawer', () => {
        cy.visit('/')
        // etc
    })

    it('Clicking Playlists drawer button opens Playlists drawer', () => {
        cy.visit('/')
        // etc
    })
})
