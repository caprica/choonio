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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.database.repositories.AlbumsRepository;

import java.util.Set;

import static java.util.stream.Collectors.toSet;
import static uk.co.caprica.choonio.database.aggregations.AlbumAggregations.albumTrack;
import static uk.co.caprica.choonio.database.aggregations.AlbumAggregations.albumTracks;
import static uk.co.caprica.choonio.database.aggregations.AlbumAggregations.artistTracks;
import static uk.co.caprica.choonio.database.aggregations.AlbumAggregations.randomAlbumTracks;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlbumsService implements Albums.Service {

    private final AlbumsRepository albumsRepository;
    private final ReactiveMongoTemplate mongoTemplate;

    private final AlbumEnrichment albumEnrichment;

    @Override
    public Flux<Album> getAlbums() {
        log.info("getAlbums()");
        return albumsRepository.findAll();
    }

    @Override
    public Flux<Album> getAlbums(String artistName) {
        log.info("getAlbums(artistName={})", artistName);
        return albumsRepository.findAllByMediaIdAlbumArtistNameOrderByYearAscMediaIdAlbumNameAsc(artistName);
    }

    @Override
    public Mono<Album> getAlbum(String artistName, String albumName) {
        log.info("getAlbum(artistName={}, albumName={})", artistName, albumName);
        return albumsRepository.findByMediaId(new AlbumId(artistName, albumName))
            .flatMap(albumEnrichment::enrichAlbum);
    }

    @Override
    public Flux<AlbumTrack> getArtistTracks(String artistName) {
        log.info("getArtistTracks(artistName={})", artistName);
        return mongoTemplate.aggregate(artistTracks(artistName), AlbumTrack.class);
    }

    @Override
    public Flux<AlbumTrack> getAlbumTracks(String artistName, String albumName) {
        log.info("getAlbumTracks(artistName={}, albumName={})", artistName, albumName);
        return mongoTemplate.aggregate(albumTracks(artistName, albumName), AlbumTrack.class);
    }

    @Override
    public Flux<AlbumTrack> getAlbumTrack(String artistName, String albumName, String trackName) {
        log.info("getAlbumTrack(artistName={}, albumName={}, trackName={})", artistName, albumName, trackName);
        return mongoTemplate.aggregate(albumTrack(artistName, albumName, trackName), AlbumTrack.class);
    }

    @Override
    public Mono<Void> deleteAlbums() {
        log.info("deleteAlbums()");
        return albumsRepository.deleteAll();
    }

    @Override
    public Flux<AlbumTrack> getTracks(Set<TrackId> trackIds) {
        log.info("getTracks(trackIds={})", trackIds);
        Set<AlbumId> albumIds = trackIds.stream()
            .map(TrackId::albumId)
            .collect(toSet());
        return albumsRepository.findAllByMediaIdIn(albumIds)
            .flatMapIterable(Album::getTracks)
            .filter(albumTrack -> trackIds.contains(albumTrack.getMediaId()));
    }

    @Override
    public Flux<AlbumTrack> getRandomTracks(int howMany) {
        log.info("getRandomTracks(howMany={})", howMany);
        return mongoTemplate.aggregate(randomAlbumTracks(howMany), AlbumTrack.class);
    }
}
