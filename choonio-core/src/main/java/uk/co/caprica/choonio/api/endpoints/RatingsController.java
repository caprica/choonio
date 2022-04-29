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

package uk.co.caprica.choonio.api.endpoints;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.domain.requests.RatingRequest;
import uk.co.caprica.choonio.service.ratings.Ratings;

@RestController
@RequestMapping("ratings")
@RequiredArgsConstructor
@Slf4j
public class RatingsController {

    private final Ratings.Service ratingsService;

    @PutMapping("{albumArtistName}/{albumName}/{trackName}")
    public Mono<Void> rateAlbumTrack(@PathVariable("albumArtistName") String albumArtistName, @PathVariable("albumName") String albumName, @PathVariable("trackName") String trackName, @RequestBody RatingRequest ratingRequest) {
        log.info("rateAlbumTrack(albumArtistName={}, albumName={}, trackName={}, ratingRequest={})", albumArtistName, albumName, trackName, ratingRequest);
        TrackId identity = new TrackId(albumArtistName, albumName, trackName);
        // Currently, ratings are a stored as an integer, to gives us future flexibility to use e.g. 5 stars rather than
        // just thumb up or thumb down, so translate here (this may change)
        int ratingValue = ratingRequest.getRating().getPersistenceValue();
        return ratingsService.rateTrack(identity, ratingValue);
    }
}
