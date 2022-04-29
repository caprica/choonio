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

package uk.co.caprica.choonio.service.transfer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.transfer.DataExport;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.favourites.Favourites;
import uk.co.caprica.choonio.service.playlists.Playlists;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.ratings.Ratings;
import uk.co.caprica.choonio.service.recents.Recents;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportService implements Transfers.ExportService {

    private static final String CURRENT_VERSION = "1.0";

    private final Favourites.Service favouritesService;
    private final Playlists.Service playlistsService;
    private final Plays.Service playsService;
    private final Ratings.Service ratingsService;
    private final Recents.Service recentsService;

    private final Clock.Service clockService;

    @Override
    public Mono<DataExport> exportData() {
        log.info("export()");
        return Mono.zip(
            favouritesService.getFavourites().collectList(),
            playlistsService.getPlaylists().collectList(),
            playsService.getAllPlays().collectList(),
            ratingsService.getAllRatings().collectList(),
            recentsService.getAllRecents().collectList()
        ).map(exports -> new DataExport(
            CURRENT_VERSION,
            exports.getT1(),
            exports.getT2(),
            exports.getT3(),
            exports.getT4(),
            exports.getT5(),
            clockService.instant()
        ));
    }
}
