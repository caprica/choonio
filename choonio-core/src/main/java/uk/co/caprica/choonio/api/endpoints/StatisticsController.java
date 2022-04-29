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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.plays.ArtistListenStats;
import uk.co.caprica.choonio.api.model.statistics.AlbumStatistics;
import uk.co.caprica.choonio.api.model.statistics.ArtistListenStatsResult;
import uk.co.caprica.choonio.api.model.statistics.ListenStatistics;
import uk.co.caprica.choonio.service.statistics.Statistics;

import java.time.LocalDate;

@RestController
@RequestMapping("statistics")
@RequiredArgsConstructor
@Slf4j
public class StatisticsController {

    private final Statistics.Service statisticsService;

    @GetMapping("albums")
    public Mono<AlbumStatistics> getAlbumStatistics() {
        log.info("getAlbumStatistics");
        return statisticsService.getAlbumStatistics();
    }

    @GetMapping("listens")
    public Mono<ListenStatistics> getListenStatistics() {
        log.info("getListenStatistics");
        return statisticsService.getListenStatistics();
    }

    @GetMapping(value = "listens/by-artist")
    public Mono<ArtistListenStatsResult> getListensByArtistForPeriod(@RequestParam(value = "from", required = false) LocalDate fromDateInclusive, @RequestParam(value = "to", required = false) LocalDate toDateExclusive, @RequestParam(value = "min", required = false, defaultValue = "0") Integer minimumListens) {
        log.info("getListensByArtistForPeriod(fromDateInclusive={}, toDateExclusive={}, minimumListens={})", fromDateInclusive, toDateExclusive, minimumListens);
        if (fromDateInclusive == null && toDateExclusive == null) {
            return statisticsService.getListensByArtist(minimumListens);
        } else {
            return statisticsService.getListensByArtistForPeriod(fromDateInclusive, toDateExclusive, minimumListens);
        }
    }
}
