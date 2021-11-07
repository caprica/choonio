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

package uk.co.caprica.choonio.service.ratings;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.database.repositories.RatingsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.clock.Clock;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;
import static uk.co.caprica.choonio.api.model.ratings.Rating.newRating;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingsService implements Ratings.Service {

    private static final int THUMBS_UP_VALUE = 1;

    private final Clock.Service clockService;

    private final RatingsRepository ratingsRepository;

    private final ServerSentEventManager eventManager;

    @Override
    public Mono<Void> rateTrack(TrackId trackIdentity, int value) {
        log.info("rateTrack(trackIdentity={}, value={})", trackIdentity, value);
        // Always delete any existing rating first, before optionally creating the new rating
        return deleteTrackRating(trackIdentity)
            .then(createTrackRating(trackIdentity, value))
            .then(ratingsChanged());
    }

    @Override
    public Mono<Map<TrackId, Rating>> getAlbumRatings(AlbumId albumIdentity) {
        log.info("getAlbumRatings(albumIdentity={})", albumIdentity);
        return ratingsRepository.findAllByMediaIdAlbumArtistNameAndMediaIdAlbumName(albumIdentity.getAlbumArtistName(), albumIdentity.getAlbumName())
            .collectMap(Rating::getMediaId);
    }

    @Override
    public Mono<Map<TrackId, Rating>> getPlaylistRatings(Playlist playlist) {
        log.info("getPlaylistRatings(playlist={})", playlist);
        List<AlbumId> albumIds = playlist.albumIds().stream()
            .distinct()
            .collect(toList());
        return Flux.fromIterable(albumIds)
            .flatMap(this::getAlbumRatings)
            .reduce((allRatings, albumRatings) -> {
                allRatings.putAll(albumRatings);
                return allRatings;
            });
    }

    @Override
    public Flux<Rating> getThumbsUpRatings() {
        return ratingsRepository.findAllByValueOrderByTimestampDesc(THUMBS_UP_VALUE);
    }

    @Override
    public Flux<Rating> getAllRatings() {
        log.info("getAllRatings()");
        return ratingsRepository.findAllByOrderByTimestampDesc();
    }

    private Mono<Void> deleteTrackRating(TrackId identity) {
        log.info("deleteTrackRating(identity={})", identity);
        return ratingsRepository.deleteByMediaId(identity);
    }

    private Mono<Void> createTrackRating(TrackId identity, int value) {
        log.info("createTrackRating(identity={}, value={})", identity, value);
        if (value != 0) {
            Rating rating = newRating(identity, value, clockService.instant());
            return ratingsRepository.save(rating).then();
        } else {
            return Mono.empty().then();
        }
    }

    private Mono<Void> ratingsChanged() {
        log.info("ratingsChanged()");
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(CollectionType.RATINGS));
            return Mono.create(MonoSink::success);
        });
    }
}
