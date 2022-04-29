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

package uk.co.caprica.choonio.library;

import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;

import java.io.File;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class LibraryTest {

    private static final Path mediaRoot = Path.of(
        "src/test/resources",
        LibraryTest.class.getPackageName().replaceAll("\\.", File.separator),
        "media-root/albums"
    );

    @Test
    void itCreatesLibraryFromMetas() {
        List<AudioMeta> metas = List.of(
            new AudioMeta(
                "Destryur",
                "Panic",
                "Destryur",
                "Dance/Electronic",
                2019,
                "Panic",
                1,
                246000,
                trackLocation("Artist1", "Album1", "01 Track1_1.mp3"),
                Instant.parse("2021-10-26T15:21:07.444Z")
            ),
            new AudioMeta(
                "Destryur",
                "Panic",
                "Destryur",
                "Dance/Electronic",
                2019,
                "Killing Demons",
                2,
                183000,
                trackLocation("Artist1", "Album1", "02 Track2_1.mp3"),
                Instant.parse("2021-10-26T15:21:08.178Z")
            ),
            new AudioMeta(
                "Jessie Frye",
                "Kiss Me in the Rain",
                "Jessie Frye",
                "Synthpop",
                2020,
                "Fantasy",
                1,
                230000,
                trackLocation("Artist2", "Album2", "01 Track1_2.mp3"),
                Instant.parse("2021-10-26T15:24:57.332Z")
            ),
            new AudioMeta(
                "Jessie Frye",
                "Kiss Me in the Rain",
                "Jessie Frye",
                "Synthpop",
                2020,
                "Angel",
                2,
                299000,
                trackLocation("Artist2", "Album2", "02 Track2_2.mp3"),
                Instant.parse("2021-10-26T15:24:59.201Z")
            ),
            new AudioMeta(
                "Neon Nox",
                "Last Stand",
                "Neon Nox",
                "Dance/Electronic",
                2020,
                "Rogue",
                1,
                247000,
                trackLocation("Artist3", "Album3", "01 Track1_3.mp3"),
                Instant.parse("2021-10-26T15:24:59.550Z")
            )
        );

        Album expectedAlbum1 = new Album(
            null,
            new AlbumId("Destryur", "Panic"),
            2019,
            "Dance/Electronic",
            List.of(
                new AlbumTrack(
                    new TrackId("Destryur", "Panic", "Panic"),
                    1,
                    "Destryur",
                    246,
                    trackLocation("Artist1", "Album1", "01 Track1_1.mp3"),
                    null
                ),
                new AlbumTrack(
                    new TrackId("Destryur", "Panic", "Killing Demons"),
                    2,
                    "Destryur",
                    183,
                    trackLocation("Artist1", "Album1", "02 Track2_1.mp3"),
                    null
                )
            ),
            429,
            new int[] {4, 252, 12},
            Instant.parse("2021-10-26T15:21:07.444Z"),
            albumLocation("Artist1", "Album1")
        );

        Album expectedAlbum2 = new Album(
            null,
            new AlbumId("Jessie Frye", "Kiss Me in the Rain"),
            2020,
            "Synthpop",
            List.of(
                new AlbumTrack(
                    new TrackId("Jessie Frye", "Kiss Me in the Rain", "Fantasy"),
                    1,
                    "Jessie Frye",
                    230,
                    trackLocation("Artist2", "Album2", "01 Track1_2.mp3"),
                    null
                ),
                new AlbumTrack(
                    new TrackId("Jessie Frye", "Kiss Me in the Rain", "Angel"),
                    2,
                    "Jessie Frye",
                    299,
                    trackLocation("Artist2", "Album2", "02 Track2_2.mp3"),
                    null
                )
            ),
            529,
            new int[] {252, 76, 244},
            Instant.parse("2021-10-26T15:24:57.332Z"),
            albumLocation("Artist2", "Album2")
        );

        // No rgb for missing cover art
        Album expectedAlbum3 = new Album(
            null,
            new AlbumId("Neon Nox", "Last Stand"),
            2020,
            "Dance/Electronic",
            List.of(
                new AlbumTrack(
                    new TrackId("Neon Nox", "Last Stand", "Rogue"),
                    1,
                    "Neon Nox",
                    247,
                    trackLocation("Artist3", "Album3", "01 Track1_3.mp3"),
                    null
                )
            ),
            247,
            null,
            Instant.parse("2021-10-26T15:24:59.550Z"),
            albumLocation("Artist3", "Album3")
        );

        Library library = new Library(metas);
        List<Album> albums = library.albums();
        assertNotNull(albums);

        Album actualAlbum1 = albums.stream().filter(album -> album.getMediaId().equals(new AlbumId("Destryur", "Panic"))).findFirst().orElseThrow();
        assertEquals(expectedAlbum1, actualAlbum1);

        Album actualAlbum2 = albums.stream().filter(album -> album.getMediaId().equals(new AlbumId("Jessie Frye", "Kiss Me in the Rain"))).findFirst().orElseThrow();
        assertEquals(expectedAlbum2, actualAlbum2);

        Album actualAlbum3 = albums.stream().filter(album -> album.getMediaId().equals(new AlbumId("Neon Nox", "Last Stand"))).findFirst().orElseThrow();
        assertEquals(expectedAlbum3, actualAlbum3);

        assertEquals(3, albums.size());
    }

    private static String albumLocation(String albumArtistName, String albumName) {
        return mediaRoot.resolve(Path.of(albumArtistName, albumName)).toString();
    }

    private static String trackLocation(String albumArtistName, String albumName, String trackName) {
        return mediaRoot.resolve(Path.of(albumArtistName, albumName, trackName)).toString();
    }
}