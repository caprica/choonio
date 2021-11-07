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

package uk.co.caprica.choonio.api.endpoints;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.plays.AlbumListenStats;
import uk.co.caprica.choonio.api.model.plays.ArtistListenStats;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.service.plays.Plays;

import java.time.LocalDate;

@RestController
@RequestMapping("plays")
@RequiredArgsConstructor
@Slf4j
public class PlaysController {

    private final Plays.Service playService;

    @GetMapping(value = "artists", params = {"limit"})
    public Flux<ArtistListenStats> getArtistListens(@RequestParam("limit") int limit) {
        log.info("getArtistListens(limit={})", limit);
        return playService.getTopArtistListens(limit);
    }

    @GetMapping(value = "artists", params = {"from", "to", "limit"})
    public Flux<ArtistListenStats> getArtistListens(@RequestParam("from") LocalDate fromDateInclusive, @RequestParam("to") LocalDate toDateExclusive, @RequestParam("limit") int limit) {
        log.info("getArtistListens(fromDateInclusive={}, toDateExclusive={}, limit={})", fromDateInclusive, toDateExclusive, limit);
        return playService.getTopArtistListens(fromDateInclusive, toDateExclusive, limit);
    }

    @GetMapping(value = "albums", params = {"limit"})
    public Flux<AlbumListenStats> getAlbumListens(@RequestParam("limit") int limit) {
        log.info("getAlbumListens(limit={})", limit);
        return playService.getTopAlbumListens(limit);
    }

    @GetMapping(value = "albums", params = {"from", "to", "limit"})
    public Flux<AlbumListenStats> getAlbumListens(@RequestParam("from") LocalDate fromDateInclusive, @RequestParam("to") LocalDate toDateExclusive, @RequestParam("limit") int limit) {
        log.info("getAlbumListens(fromDateInclusive={}, toDateExclusive={}, limit={})", fromDateInclusive, toDateExclusive, limit);
        return playService.getTopAlbumListens(fromDateInclusive, toDateExclusive ,limit);
    }

    @GetMapping(value = "tracks", params = {"limit"})
    public Flux<TrackListenStats> getTrackListens(@RequestParam("limit") int limit) {
        log.info("getTrackListens(limit={})", limit);
        return playService.getTopTrackListens(limit);
    }

    @GetMapping(value = "tracks", params = {"from", "to", "limit"})
    public Flux<TrackListenStats> getTrackListens(@RequestParam("from") LocalDate fromDateInclusive, @RequestParam("to") LocalDate toDateExclusive, @RequestParam("limit") int limit) {
        log.info("getTrackListens(fromDateInclusive={}, toDateExclusive={}, limit={})", fromDateInclusive, toDateExclusive, limit);
        return playService.getTopTrackListens(fromDateInclusive, toDateExclusive, limit);
    }
}
