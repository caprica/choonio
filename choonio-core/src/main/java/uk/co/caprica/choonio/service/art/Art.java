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

package uk.co.caprica.choonio.service.art;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.art.ArtSize;
import uk.co.caprica.choonio.api.model.identity.MediaId;

import java.awt.image.BufferedImage;
import java.nio.file.Path;
import java.util.List;

public interface Art {

    interface Service {
        void generateArt(List<String> mediaRoots);
        Mono<Path> getArtistArtPath(String albumArtistName);
        Mono<Path> getAlbumArtPath(String albumArtistName, String albumName);
        Mono<Path> getTrackArtPath(String albumArtistName, String albumName, String trackName);
        Flux<Path> getPlaylistArtPaths(String playlistName);
        Mono<Path> getAutoPlaylistArtPath(String autoPlaylistId);
        Mono<BufferedImage> getImage(MediaId mediaId, ArtSize artSize);
        Mono<byte[]> generateCompositeArt(List<Path> artPaths, ArtSize artSize);
    }
}
