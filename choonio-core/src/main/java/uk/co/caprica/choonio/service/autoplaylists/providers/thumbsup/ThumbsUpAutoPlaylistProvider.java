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

package uk.co.caprica.choonio.service.autoplaylists.providers.thumbsup;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.service.autoplaylists.providers.AutoPlaylistProvider;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.playlists.PlaylistEnrichment;
import uk.co.caprica.choonio.service.ratings.Ratings;

@Component("Thumbs up")
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
@Slf4j
public class ThumbsUpAutoPlaylistProvider implements AutoPlaylistProvider {

    private static final String NAME = "Thumbs up";
    private static final String DESCRIPTION = "All tracks rated thumbs up";

    private final Clock.Service clockService;
    private final Ratings.Service ratingsService;

    private final PlaylistEnrichment playlistEnrichment;

    @Override
    public Mono<Playlist> getPlaylist() {
        log.info("getThumbsUpPlaylist()");
        return ratingsService.getThumbsUpRatings()
            .map(Rating::getMediaId)
            .collectList()
            .flatMap(trackIds -> convertToPlaylist(NAME, DESCRIPTION, trackIds, clockService.instant()))
            .flatMap(playlistEnrichment::enrichPlaylist);
    }
}
