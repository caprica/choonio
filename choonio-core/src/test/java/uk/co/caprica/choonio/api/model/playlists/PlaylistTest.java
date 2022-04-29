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

package uk.co.caprica.choonio.api.model.playlists;

import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PlaylistTest {

    @Test
    void itCreatesPlaylist() {
        Playlist result = Playlist.newPlaylist(
            new PlaylistId("Top bangers"),
            "The chooniest choons",
            Instant.parse("2021-09-28T18:26:13.333Z")
        );
        assertNotNull(result);
        assertNull(result.getId());
        assertEquals(new PlaylistId("Top bangers"), result.getMediaId());
        assertEquals("The chooniest choons", result.getDescription());
        assertNotNull(result.getItems());
        assertTrue(result.getItems().isEmpty());
        assertEquals(0, result.getDuration());
        assertEquals(Instant.parse("2021-09-28T18:26:13.333Z"), result.getCreated());
        assertEquals(Instant.parse("2021-09-28T18:26:13.333Z"), result.getUpdated());
    }

    @Test
    void itReturnsTrackIds() {
        List<TrackId> result = playlist().trackIds();
        assertNotNull(result);
        assertEquals(new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"), result.get(0));
        assertEquals(new TrackId("New Arcades", "In the Deepest of Dreams", "Don't Stop Dreaming (feat. Dana Jean Phoenix)"), result.get(1));
        assertEquals(2, result.size());
    }

    @Test
    void itReturnsAlbumIds() {
        List<AlbumId> result = playlist().albumIds();
        assertNotNull(result);
        assertEquals(new AlbumId("Absolute Valentine", "Police Heartbreaker"), result.get(0));
        assertEquals(new AlbumId("New Arcades", "In the Deepest of Dreams"), result.get(1));
        assertEquals(2, result.size());
    }

    private static Playlist playlist() {
        return new Playlist(
            "1",
            new PlaylistId("Synthwave"),
            "The best genre",
            List.of(
                new PlaylistItem(
                    "101",
                    new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
                    null
                ),
                new PlaylistItem(
                    "202",
                    new TrackId("New Arcades", "In the Deepest of Dreams", "Don't Stop Dreaming (feat. Dana Jean Phoenix)"),
                    null
                )
            ),
            14224,
            Instant.parse("2021-09-01T05:05:05.555Z"),
            Instant.parse("2021-09-02T06:06:06.666Z")
        );
    }
}
