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

package uk.co.caprica.choonio.service.albums;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.TrackId;

import java.util.Set;

public interface Albums {

    interface Service {
        Flux<Album> getAlbums();
        Flux<Album> getAlbums(String artistName);
        Mono<Album> getAlbum(String artistName, String albumName);
        Flux<AlbumTrack> getArtistTracks(String artistName);
        Flux<AlbumTrack> getAlbumTracks(String artistName, String albumName);
        Flux<AlbumTrack> getAlbumTrack(String artistName, String albumName, String trackName);
        Mono<Void> deleteAlbums();
        Flux<AlbumTrack> getTracks(Set<TrackId> trackIds);
        Flux<AlbumTrack> getRandomTracks(int howMany);
    }
}
