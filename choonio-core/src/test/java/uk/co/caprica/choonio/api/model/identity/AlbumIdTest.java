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

package uk.co.caprica.choonio.api.model.identity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AlbumIdTest {

    @Test
    void itReturnsAlbumNameForName() {
        AlbumId albumId = new AlbumId("Signal Void", "This Liminal Reality");
        assertEquals("This Liminal Reality", albumId.name());
    }

    @Test
    void itReturnsArtistId() {
        AlbumId albumId = new AlbumId("Signal Void", "This Liminal Reality");
        assertEquals(new ArtistId("Signal Void"), albumId.artistId());
    }
}
