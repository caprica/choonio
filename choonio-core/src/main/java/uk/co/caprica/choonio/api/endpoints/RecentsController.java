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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.service.recents.Recents;

/**
 * Most recently played media.
 * <p>
 * Note that when returning recently played media, it is by design that duplicate media is not returned. If the same
 * media is played multiple times in any given period of time, we generally only want to see the latest.
 * <p>
 * This can lead to some potentially surprising effects.
 * <p>
 * Specifically, if we play the exact same media today as we did yesterday, then it will look (from the recently played
 * perspective) that we played nothing yesterday - since yesterday's recent media would be filtered as duplicates.
 * <p>
 * Remember, this is intentional, when dealing with recently played media what we're most interested in is what was
 * played most recently - not necessarily what was played on what particular day.
 */
@RestController
@RequestMapping("recent")
@RequiredArgsConstructor
@Slf4j
public class RecentsController {

    private final Recents.Service recentsService;

    @GetMapping
    public Flux<Recent> getRecent(@RequestParam(name = "type", required = false) MediaType type, @RequestParam(name = "limit", required = false) Integer limit) {
        log.info("getRecent(type={}, limit={})", type, limit);
        return recentsService.getRecents(type, limit);
    }

    @DeleteMapping("{recentId}")
    public Mono<Void> removeRecent(@PathVariable("recentId") String recentId) {
        log.info("removeRecent(recentId={})", recentId);
        return recentsService.removeRecent(recentId);
    }
}
