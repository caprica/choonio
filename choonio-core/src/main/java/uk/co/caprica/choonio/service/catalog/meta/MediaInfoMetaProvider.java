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

import lombok.extern.slf4j.Slf4j;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;
import uk.co.caprica.mediascanner.domain.MediaEntry;
import uk.co.caprica.mediascanner.meta.MetaProvider;
import uk.co.caprica.vlcjinfo.Duration;
import uk.co.caprica.vlcjinfo.MediaInfo;
import uk.co.caprica.vlcjinfo.Section;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public final class MediaInfoMetaProvider implements MetaProvider {

    private static final String GENERAL_SECTION = "General";

    private static final String ALBUM_ARTIST = "Album/Performer";
    private static final String ALBUM_NAME = "Album";
    private static final String ARTIST_NAME = "Performer";
    private static final String GENRE_DESCRIPTION = "Genre";
    private static final String RELEASED_DATE = "Released date";
    private static final String RECORDED_DATE = "Recorded date";
    private static final String TRACK_NAME = "Track name";
    private static final String TRACK_NUMBER = "Track name/Position";
    private static final String DURATION = "Duration";

    private static final String FILENAME = "Complete name";
    private static final String FILE_LAST_MODIFICATION_DATE = "File last modification date";

    private static final Pattern TRACK_NUMBER_PATTERN = Pattern.compile("(\\d+)/(\\d+)");

    public static final String AUDIO_META = "audioMeta";

    @Override
    public void addMeta(MediaEntry entry, Object context) {
        log.trace("addMeta(entry={}, context={})", entry, context);
        MediaInfo mediaInfo = MediaInfo.mediaInfo(entry.file().toString());
        if (mediaInfo == null) {
            return;
        }
        Section generalSection = mediaInfo.first(GENERAL_SECTION);
        if (generalSection == null) {
            return;
        }
        try {
            Duration duration = generalSection.duration(DURATION);
            AudioMeta meta = new AudioMeta(
                generalSection.value(ALBUM_ARTIST),
                generalSection.value(ALBUM_NAME),
                generalSection.value(ARTIST_NAME),
                generalSection.value(GENRE_DESCRIPTION),
                getDate(generalSection),
                generalSection.value(TRACK_NAME),
                getTrackNumber(generalSection),
                duration != null ? (int) duration.asMilliSeconds() : 0,
                generalSection.value(FILENAME),
                getFileModificationDate(generalSection)
            );
            entry.put(AUDIO_META, meta);
        } catch (Exception e) {
            log.error("Failed to process meta data for '{}': {}", entry.file(), e.getMessage());
        }
    }

    private static Integer getDate(Section section) {
        Integer date = section.integer(RELEASED_DATE);
        if (date == null) {
            date = section.integer(RECORDED_DATE);
        }
        return date;
    }

    private static Integer getTrackNumber(Section section) {
        try {
            return section.integer(TRACK_NUMBER);
        } catch (Exception e) {
        }
        // This may be obsolete...
        try {
            String stringValue = section.value(TRACK_NUMBER);
            Matcher matcher = TRACK_NUMBER_PATTERN.matcher(stringValue);
            if (matcher.matches()) {
                return Integer.parseInt(matcher.group(1));
            }
        } catch (Exception e) {
            log.warn("Failed to get track number", e);
        }
        return null;
    }

    private static Instant getFileModificationDate(Section section) {
        try {
            String stringValue = section.value(FILE_LAST_MODIFICATION_DATE);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("'UTC 'yyyy-MM-dd HH:mm:ss").withZone(ZoneOffset.UTC);
            return formatter.parse(stringValue, Instant::from);
        } catch (Exception e) {
            log.warn("Failed to get file modification date", e);
        }
        return null;
    }
}
