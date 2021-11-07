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

package uk.co.caprica.choonio.service.catalog.meta;

import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;
import uk.co.caprica.mediascanner.domain.MediaEntry;
import uk.co.caprica.mediascanner.domain.MediaTitle;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JaudioTaggerMetaProviderTest {

    private static final Path mediaRoot = Path.of(
        "src/test/resources",
        JaudioTaggerMetaProviderTest.class.getPackageName().replaceAll("\\.", File.separator)
    );

    @Test
    @SneakyThrows
    void itExtractsMetaData() {
        // You can not read the file from the classpath, as it is copied to the target/classes folder and will get a new
        // timestamp
        Path samplePath = mediaRoot.resolve("meta-sample.mp3");
        assertTrue(samplePath.toFile().setLastModified(Instant.parse("2021-10-24T20:40:13Z").toEpochMilli()));

        JaudiotaggerMetaProvider metaProvider = new JaudiotaggerMetaProvider();
        MediaEntry entry = new MediaEntry(samplePath, new MediaTitle("Meta Sample"));

        metaProvider.addMeta(entry, null);
        AudioMeta result = entry.value(JaudiotaggerMetaProvider.AUDIO_META, AudioMeta.class);

        assertNotNull(result);
        assertEquals("Various Artists", result.getAlbumArtistName());
        assertEquals("The Artist", result.getArtistName());
        assertEquals("Test Samples", result.getAlbumName());
        assertEquals("Meta Sample", result.getTrackName());
        assertEquals("Dance/Electronic", result.getGenre());
        assertEquals(3, result.getTrackNumber());
        assertEquals(2021, result.getYear());
        assertEquals(15000, result.getDuration());
        assertEquals("meta-sample.mp3", Path.of(result.getFileName()).getFileName().toString());
        assertEquals(Instant.parse("2021-10-24T20:40:13Z"), result.getTimestamp());
    }

    @Test
    void itSkipsMetaWhenNoMediaFile() {
        Path missingPath = Paths.get("src/test/resources/uk/co/caprica/choonio/service/catalog/meta/missing.mp3");

        JaudiotaggerMetaProvider metaProvider = new JaudiotaggerMetaProvider();
        MediaEntry entry = new MediaEntry(missingPath, new MediaTitle("Meta Sample"));

        metaProvider.addMeta(entry, null);
        AudioMeta result = entry.value(JaudiotaggerMetaProvider.AUDIO_META, AudioMeta.class);
        assertNull(result);
    }
}
