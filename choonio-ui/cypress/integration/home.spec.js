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

describe('Home Page', () => {
    it('Clicking "Recent Activity" in the main content area navigates to the Recents page', () => {
        cy.visit('/')
        cy.get('main').contains('Recent Activity').click()
        cy.url().should('include', '/recent')
    })

    it('Clicking "Favourites" in the main content area navigates to the Favourites page', () => {
        cy.visit('/')
        cy.get('main').contains('Favourites').click()
        cy.url().should('include', '/favourites')
    })

    it('Clicking "Playlists" in the main content area navigates to the Playlists page', () => {
        cy.visit('/')
        cy.get('main').contains('Playlists').click()
        cy.url().should('include', '/playlists')
    })

    it('Displays Home page', () => {
        cy.visit('http://localhost:3000')

        cy.contains('Neon Nox')

        // various things...
    })

    // Just examples for now...

    it('Clicking a recent artist navigates to the Artist page', () => {
        cy.visit('/')
        cy.contains('Neon Nox').click()
        cy.url().should('include', '/albums/Neon%20Nox')
    })

    it('Clicking a recent album navigates to the Album page', () => {
        cy.visit('/')
        cy.contains('LiveDieRepeat').click()
        cy.url().should('include', '/albums/Kick%20Puncher/LiveDieRepeat')
    })

    it('Clicking a recent track navigates to the Album page', () => {
        cy.visit('/')
        cy.contains('Flashbacks').click()
        cy.url().should('include', '/albums/W%20O%20L%20F%20C%20L%20U%20B/Just%20Drive%20-%20Part%202')
    })

    it('Clicking a recent playlist navigates to the Playlist page', () => {
        cy.visit('/')
        cy.contains('Synthwave').click()
        cy.url().should('include', '/playlist/Synthwave')
    })
})
