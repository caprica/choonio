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

package uk.co.caprica.choonio.api.model.albums;

import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AlbumTest {

    @Test
    void itReturnsAlbumTrack() {
        AlbumTrack result = album().albumTrack(new TrackId("Dana Jean Phoenix", "PixelDust", "Far and Away"));
        assertNotNull(result);
        assertEquals(new TrackId("Dana Jean Phoenix", "PixelDust", "Far and Away"), result.getMediaId());
    }

    @Test
    void itThrowsExceptionForUnknownTrack() {
        assertThrows(IllegalArgumentException.class, () ->
            album().albumTrack(new TrackId("Dana Jean Phoenix", "PixelDust", "Far and AwayX"))
        );
    }

    private static Album album() {
        return new Album(
            "100",
            new AlbumId("Dana Jean Phoenix", "PixelDust"),
            2018,
            "Dance/Electronic",
            List.of(
                new AlbumTrack(
                    new TrackId("Dana Jean Phoenix", "PixelDust", "Losing the Connection"),
                    1,
                    "Dana Jean Phoenix",
                    235,
                    "filename1",
                    null
                ),
                new AlbumTrack(
                    new TrackId("Dana Jean Phoenix", "PixelDust", "Far and Away"),
                    2,
                    "Dana Jean Phoenix",
                    224,
                    "filename2",
                    null
                )
            ),
            2514,
            new int[] { 10, 20, 30 },
            Instant.parse("2021-09-28T18:45:52.888Z"),
            "location"
        );
    }
}
