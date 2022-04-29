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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.service.highlights.Highlights;

@RestController
@RequestMapping("highlights")
@RequiredArgsConstructor
@Slf4j
public class HighlightsController {

    private final Highlights.Service highlightsService;

    @GetMapping
    public Flux<Highlight> getHighlights() {
        log.info("getHighlights()");
        return highlightsService.getHighlights();
    }

    @PostMapping
    public Mono<Void> refreshHighlights() {
        log.info("refreshHighlights()");
        return highlightsService.refreshHighlights();
    }
}
