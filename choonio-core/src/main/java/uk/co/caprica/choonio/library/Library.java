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

import de.androidpit.colorthief.ColorThief;
import de.androidpit.colorthief.MMCQ;
import lombok.extern.slf4j.Slf4j;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.util.Collections.unmodifiableMap;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

@Slf4j
public final class Library {

    private static final int COLOUR_COUNT = 5;

    private final Map<String, List<Album>> albums;

    /**
     * Create a media library from the given media metadata.
     *
     * @param metas collection of <em>validated</em> meta data
     */
    public Library(List<AudioMeta> metas) {
        this.albums = unmodifiableMap(getAlbums(metas));
    }

    public List<Album> albums() {
        return albums.values().stream()
            .flatMap(List::stream)
            .collect(toList());
    }

    private Map<String, List<Album>> getAlbums(List<AudioMeta> metas) {
        log.info("getAlbums()");
        return metas.stream()
            .collect(groupingBy(meta -> new AlbumId(meta.getAlbumArtistName(), meta.getAlbumName())))
            .entrySet()
            .stream()
            .map(entry -> getAlbum(entry.getKey(), entry.getValue()))
            .collect(groupingBy(album -> album.getMediaId().getAlbumArtistName()));
    }

    private Album getAlbum(AlbumId albumId, List<AudioMeta> metas) {
        log.debug("getAlbum(albumId={}, metas={})", albumId, metas);
        List<AlbumTrack> albumTracks = new ArrayList<>(metas.size());
        for (AudioMeta meta : metas) {
            albumTracks.add(metaToAlbumTrack(meta));
        }
        return getAlbum(albumId, metas, albumTracks);
    }

    private static Album getAlbum(AlbumId albumId, List<AudioMeta> metas, List<AlbumTrack> albumTracks) {
        // There is guaranteed always at least one track
        AudioMeta representativeMeta = metas.get(0);
        return new Album(
            null,
            albumId,
            representativeMeta.getYear(),
            representativeMeta.getGenre(),
            albumTracks,
            albumDuration(albumTracks),
            albumRgb(representativeMeta),
            albumTimestamp(metas),
            Path.of(representativeMeta.getFileName()).getParent().toString()
        );
    }

    private static AlbumTrack metaToAlbumTrack(AudioMeta meta) {
        log.debug("metaToAlbumTrack(meta={})", meta);
        return new AlbumTrack(
            new TrackId(
                meta.getAlbumArtistName(),
                meta.getAlbumName(),
                meta.getTrackName()
            ),
            meta.getTrackNumber(),
            meta.getArtistName(),
            meta.getDuration() / 1000,
            meta.getFileName(),
            null
        );
    }

    private static int albumDuration(List<AlbumTrack> albumTracks) {
        return albumTracks.stream()
            .map(AlbumTrack::getDuration)
            .mapToInt(Integer::intValue)
            .sum();
    }

    private static Instant albumTimestamp(List<AudioMeta> metas) {
        return metas.stream()
            .min(comparing(AudioMeta::getTimestamp))
            .map(AudioMeta::getTimestamp)
            .orElseThrow(IllegalStateException::new);
    }

    private static int[] albumRgb(AudioMeta meta) {
        Path coverArtPath = Path.of(meta.getFileName()).getParent().resolve("cover.jpg");
        log.debug("coverArtPath={}", coverArtPath);
        try {
            BufferedImage image = ImageIO.read(coverArtPath.toFile());
            MMCQ.CMap colours = ColorThief.getColorMap(image, COLOUR_COUNT);
            MMCQ.VBox dominantColour = colours.vboxes.get(0);
            return dominantColour.avg(false);
        } catch (IOException e) {
            log.warn("Failed to extract RGB for cover art: {} failed because {}", coverArtPath, e.getMessage());
            return null;
        }
    }
}
