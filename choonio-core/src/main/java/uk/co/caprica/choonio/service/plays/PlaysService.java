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

package uk.co.caprica.choonio.service.plays;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.plays.AlbumListenStats;
import uk.co.caprica.choonio.api.model.plays.ArtistListenStats;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.database.repositories.PlaysRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;
import static uk.co.caprica.choonio.api.model.plays.Play.newPlay;
import static uk.co.caprica.choonio.database.aggregations.PlayAggregations.albumTrackListensAggregation;
import static uk.co.caprica.choonio.database.aggregations.PlayAggregations.topAlbumListensAggregation;
import static uk.co.caprica.choonio.database.aggregations.PlayAggregations.topArtistListensAggregation;
import static uk.co.caprica.choonio.database.aggregations.PlayAggregations.topTrackListensAggregation;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaysService implements Plays.Service {

    private final Clock.Service clockService;

    private final PlaysRepository playsRepository;

    private final ReactiveMongoTemplate mongoTemplate;

    private final ServerSentEventManager eventManager;

    @Override
    public Mono<Play> create(String albumArtistName, String albumName, String trackName) {
        log.info("create(albumArtistName={}, albumName={}, trackName={})", albumArtistName, albumName, trackName);
        return playsRepository.save(newPlay(new TrackId(albumArtistName, albumName, trackName), clockService.instant()))
            .flatMap(play -> playsChanged()
                .thenReturn(play)
            );
    }

    @Override
    public Mono<Map<TrackId, TrackListenStats>> getAlbumListens(AlbumId albumIdentity) {
        log.info("getAlbumListens(albumIdentity={})", albumIdentity);
        return mongoTemplate.aggregate(
            albumTrackListensAggregation(albumIdentity),
            Play.class,
            TrackListenStats.class
        )
        .collectMap(TrackListenStats::getMediaId);
    }

    @Override
    public Mono<Map<TrackId, TrackListenStats>> getPlaylistListens(Playlist playlist) {
        log.info("getPlaylistListens(playlist={})", playlist);
        List<AlbumId> albumIds = playlist.albumIds().stream()
            .distinct()
            .collect(toList());
        return Flux.fromIterable(albumIds)
            .flatMap(this::getAlbumListens)
            .reduce((allListens, albumListens) -> {
                allListens.putAll(albumListens);
                return allListens;
            });
    }

    @Override
    public Flux<ArtistListenStats> getTopArtistListens(int limit) {
        log.info("getTopArtistListens(limit={})", limit);
        return mongoTemplate.aggregate(
            topArtistListensAggregation(limit),
            Play.class,
            ArtistListenStats.class
        );
    }

    @Override
    public Flux<ArtistListenStats> getTopArtistListens(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit) {
        log.info("getTopArtistListens(fromDateInclusive={}, toDateExclusive={}, limit={})", fromDateInclusive, toDateExclusive, limit);
        return mongoTemplate.aggregate(
            topArtistListensAggregation(fromDateInclusive, toDateExclusive, limit),
            Play.class,
            ArtistListenStats.class
        );
    }

    @Override
    public Flux<AlbumListenStats> getTopAlbumListens(int limit) {
        log.info("getTopAlbumListens(limit={})", limit);
        return mongoTemplate.aggregate(
            topAlbumListensAggregation(limit),
            Play.class,
            AlbumListenStats.class
        );
    }

    @Override
    public Flux<AlbumListenStats> getTopAlbumListens(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit) {
        log.info("getTopAlbumListens(fromDateInclusive={}, toDateExclusive={}, limit={})", fromDateInclusive, toDateExclusive, limit);
        return mongoTemplate.aggregate(
            topAlbumListensAggregation(fromDateInclusive, toDateExclusive, limit),
            Play.class,
            AlbumListenStats.class
        );
    }

    @Override
    public Flux<TrackListenStats> getTopTrackListens(int limit) {
        log.info("getTopTrackListens(limit={})", limit);
        return mongoTemplate.aggregate(
            topTrackListensAggregation(limit),
            Play.class,
            TrackListenStats.class
        );
    }

    @Override
    public Flux<TrackListenStats> getTopTrackListens(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit) {
        log.info("getTopTrackListens(fromDateInclusive={}, toDateExclusive={}, limit={})", fromDateInclusive, toDateExclusive, limit);
        return mongoTemplate.aggregate(
            topTrackListensAggregation(fromDateInclusive, toDateExclusive, limit),
            Play.class,
            TrackListenStats.class
        );
    }

    @Override
    public Flux<Play> getAllPlays() {
        log.info("getAllPlays()");
        return playsRepository.findAllByOrderByTimestampDesc();
    }

    private Mono<Void> playsChanged() {
        log.info("playsChanged()");
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(CollectionType.PLAYS));
            return Mono.create(MonoSink::success);
        });
    }
}
