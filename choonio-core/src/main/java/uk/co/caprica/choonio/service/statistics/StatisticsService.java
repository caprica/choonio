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

package uk.co.caprica.choonio.service.statistics;

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
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.statistics.AlbumStatistics;
import uk.co.caprica.choonio.api.model.statistics.ListenStatistics;
import uk.co.caprica.choonio.database.repositories.AlbumsRepository;
import uk.co.caprica.choonio.database.repositories.PlaysRepository;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static java.util.stream.Collectors.toSet;
import static uk.co.caprica.choonio.database.aggregations.StatisticsAggregations.albumStatistics;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsService implements Statistics.Service {

    private final ReactiveMongoTemplate mongoTemplate;

    private final AlbumsRepository albumsRepository;
    private final PlaysRepository playsRepository;

    @Override
    public Mono<AlbumStatistics> getAlbumStatistics() {
        log.info("getAlbumStatistics()");
        return mongoTemplate.aggregate(albumStatistics(), AlbumStatistics.class)
            .next();
    }

    @Override
    public Mono<ListenStatistics> getListenStatistics() {
        log.info("getListenStatistics()");
        return getPlayedTrackIds()
            .flatMap(trackIds -> getAlbums(trackIds)
                .map(albums -> {
                    int count = getCount(trackIds, albums);
                    int duration = getDuration(trackIds, albums);
                    return new ListenStatistics(count, duration);
                })
            );
    }

    private Mono<List<TrackId>> getPlayedTrackIds() {
        return playsRepository.findAll()
            .map(Play::getMediaId)
            .collectList();
    }

    private Mono<Map<AlbumId, Album>> getAlbums(List<TrackId> trackIds) {
        Set<AlbumId> uniqueAlbumIds = trackIds.stream()
            .map(TrackId::albumId)
            .collect(toSet());
        return Flux.fromIterable(uniqueAlbumIds)
            .flatMap(albumsRepository::findByMediaId)
            .collectMap(Album::getMediaId);
    }

    private int getCount(List<TrackId> trackIds, Map<AlbumId, Album> albums) {
        return Math.toIntExact(trackIds.stream()
            .map(TrackId::albumId)
            .map(albums::get)
            .filter(Objects::nonNull)
            .count());
    }

    private int getDuration(List<TrackId> trackIds, Map<AlbumId, Album> albums) {
        return trackIds.stream()
            .map(trackId -> {
                Album album = albums.get(trackId.albumId());
                if (album != null) {
                    AlbumTrack albumTrack = album.albumTrack(trackId);
                    if (albumTrack != null) {
                        return albumTrack.getDuration();
                    }
                }
                return 0;
            })
            .reduce(0, Integer::sum);
    }
}