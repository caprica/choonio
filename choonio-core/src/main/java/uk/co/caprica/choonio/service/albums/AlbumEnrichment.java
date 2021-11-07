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

package uk.co.caprica.choonio.service.albums;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.albums.TrackStats;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.Ratings;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;
import static uk.co.caprica.choonio.api.model.albums.RatingValue.ratingValue;

@Component
@RequiredArgsConstructor
class AlbumEnrichment {

    private final Plays.Service playsService;
    private final Ratings.Service ratingsService;

    Mono<Album> enrichAlbum(Album album) {
        return Mono.zip(
            playsService.getAlbumListens(album.getMediaId()),
            ratingsService.getAlbumRatings(album.getMediaId()),
            (listens, ratings) -> applyStats(album, listens, ratings)
        );
    }

    private static Album applyStats(Album album, Map<TrackId, TrackListenStats> listens, Map<TrackId, Rating> ratings) {
        List<AlbumTrack> enrichedTracks = album.getTracks().stream()
            .map(track -> applyStats(track, listens, ratings))
            .collect(toList());
        return album.withTracks(enrichedTracks);
    }

    private static AlbumTrack applyStats(AlbumTrack track, Map<TrackId, TrackListenStats> listens, Map<TrackId, Rating> ratings) {
        TrackListenStats trackListens = listens.get(track.getMediaId());
        Rating trackRating = ratings.get(track.getMediaId());
        TrackStats stats = new TrackStats(
            trackListens != null ? trackListens.getListens() : 0,
            ratingValue(trackRating != null ? trackRating.getValue() : 0)
        );
        return track.withStats(stats);
    }
}
