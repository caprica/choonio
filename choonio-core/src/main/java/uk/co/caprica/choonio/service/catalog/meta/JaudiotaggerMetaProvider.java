package uk.co.caprica.choonio.service.catalog.meta;

import lombok.extern.slf4j.Slf4j;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;
import uk.co.caprica.mediascanner.domain.MediaEntry;
import uk.co.caprica.mediascanner.meta.MetaProvider;

import java.io.File;
import java.time.Instant;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class JaudiotaggerMetaProvider implements MetaProvider {

    public static final String AUDIO_META = "audioMeta";

    private static final Pattern defaultTitlePattern = Pattern.compile("(?:\\d+\\s)?(.+)\\..*");
    private static final Pattern defaultTrackNumberPattern = Pattern.compile("(\\d+)\\s(.+)\\..*");

    @Override
    public void addMeta(MediaEntry entry, Object context) {
        File file = entry.file().toFile();
        try {
            AudioFile audioFile = AudioFileIO.read(file);
            AudioHeader audioHeader = audioFile.getAudioHeader();
            if (audioHeader != null) {
                Tag tag = audioFile.getTag();
                if (tag != null) {
                    AudioMeta meta = new AudioMeta(
                        tag.getFirst(FieldKey.ALBUM_ARTIST),
                        tag.getFirst(FieldKey.ALBUM),
                        tag.getFirst(FieldKey.ARTIST),
                        genre(tag),
                        year(tag),
                        tag.getFirst(FieldKey.TITLE),
                        Integer.parseInt(tag.getFirst(FieldKey.TRACK)),
                        audioHeader.getTrackLength() * 1000,
                        file.getAbsolutePath(),
                        Instant.ofEpochMilli(file.lastModified())
                    );
                    entry.put(AUDIO_META, meta);
                }
            }
            entry.put(AUDIO_META, defaultAudioMeta(file));
        } catch (InvalidAudioFrameException e) {
            entry.put(AUDIO_META, defaultAudioMeta(file));
        } catch (Exception e) {
            log.error("Failed to process meta data for '{}': {}", file, e.getMessage());
        }
    }

    private static Integer year(Tag tag) {
        String value = tag.getFirst(FieldKey.YEAR);
        if (missing(value)) {
            // Special case, uncommon
            value = tag.getFirst("TDRL");
        }
        return value != null ? Integer.parseInt(value) : null;
    }

    private static String genre(Tag tag) {
        String value = tag.getFirst(FieldKey.GENRE);
        return value != null && value.length() > 0 ? value : null;
    }

    private static boolean missing(String value) {
        return value == null || value.length() == 0;
    }

    private static AudioMeta defaultAudioMeta(File file) {
        return new AudioMeta(
            null,
            null,
            null,
            null,
            null,
            defaultTitle(file),
            defaultTrackNumber(file),
            0,
            file.getAbsolutePath(),
            Instant.ofEpochMilli(file.lastModified())
        );
    }

    private static String defaultTitle(File file) {
        Matcher matcher = defaultTitlePattern.matcher(file.getName());
        if (matcher.matches()) {
            return matcher.group(1);
        } else {
            return null;
        }
    }

    private static Integer defaultTrackNumber(File file) {
        Matcher matcher = defaultTrackNumberPattern.matcher(file.getName());
        if (matcher.matches()) {
            return Integer.parseInt(matcher.group(1));
        } else {
            return null;
        }
    }
}
