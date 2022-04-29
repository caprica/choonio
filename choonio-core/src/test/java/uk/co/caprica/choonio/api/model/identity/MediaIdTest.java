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

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

class MediaIdTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    void beforeEach() {
        objectMapper = new ObjectMapper();
    }

    @Test
    @SneakyThrows
    void itMarshalsArtistIdToJson() {
        String expected = readJsonResource(getClass(), "artist-id.json");
        MediaId mediaId = new ArtistId("Neon Nox");
        String result = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(mediaId);
        assertEquals(expected, result);
    }

    @Test
    @SneakyThrows
    void itMarshalsAlbumIdToJson() {
        String expected = readJsonResource(getClass(), "album-id.json");
        MediaId mediaId = new AlbumId("Neon Nox", "Last Stand");
        String result = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(mediaId);
        assertEquals(expected, result);
    }

    @Test
    @SneakyThrows
    void itMarshalsTrackIdToJson() {
        String expected = readJsonResource(getClass(), "track-id.json");
        MediaId mediaId = new TrackId("Neon Nox", "Last Stand", "Recon");
        String result = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(mediaId);
        assertEquals(expected, result);
    }

    @Test
    @SneakyThrows
    void itMarshalsPlaylistIdToJson() {
        String expected = readJsonResource(getClass(), "playlist-id.json");
        MediaId mediaId = new PlaylistId("Synthwave");
        String result = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(mediaId);
        assertEquals(expected, result);
    }

    @Test
    @SneakyThrows
    void itUnmarshalsArtistIdFromJson() {
        MediaId expected = new ArtistId("Neon Nox");
        String json = readJsonResource(getClass(), "artist-id.json");
        MediaId result = objectMapper.readValue(json, MediaId.class);
        assertEquals(expected, result);
    }

    @Test
    @SneakyThrows
    void itUnmarshalsAlbumIdFromJson() {
        MediaId expected = new AlbumId("Neon Nox", "Last Stand");
        String json = readJsonResource(getClass(), "album-id.json");
        MediaId result = objectMapper.readValue(json, MediaId.class);
        assertEquals(expected, result);
    }

    @Test
    @SneakyThrows
    void itUnmarshalsTrackIdFromJson() {
        MediaId expected = new TrackId("Neon Nox", "Last Stand", "Recon");
        String json = readJsonResource(getClass(), "track-id.json");
        MediaId result = objectMapper.readValue(json, MediaId.class);
        assertEquals(expected, result);
    }

    @Test
    @SneakyThrows
    void itUnmarshalsPlaylistIdFromJson() {
        MediaId expected = new PlaylistId("Synthwave");
        String json = readJsonResource(getClass(), "playlist-id.json");
        MediaId result = objectMapper.readValue(json, MediaId.class);
        assertEquals(expected, result);
    }
}