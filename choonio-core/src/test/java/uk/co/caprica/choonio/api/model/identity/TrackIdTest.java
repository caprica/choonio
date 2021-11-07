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

package uk.co.caprica.choonio.api.model.identity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TrackIdTest {

    @Test
    void itReturnsTrackNameForName() {
        TrackId trackId = new TrackId("Signal Void", "This Liminal Reality", "Gaia");
        assertEquals("Gaia", trackId.name());
    }

    @Test
    void itReturnsArtistId() {
        TrackId trackId = new TrackId("Signal Void", "This Liminal Reality", "Gaia");
        assertEquals(new ArtistId("Signal Void"), trackId.artistId());
    }

    @Test
    void itReturnsAlbumId() {
        TrackId trackId = new TrackId("Signal Void", "This Liminal Reality", "Gaia");
        assertEquals(new AlbumId("Signal Void", "This Liminal Reality"), trackId.albumId());
    }
}
