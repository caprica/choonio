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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.search.CombinedSearchResults;
import uk.co.caprica.choonio.service.search.Search;
import uk.co.caprica.choonio.service.search.model.SearchRequest;

@RestController
@RequestMapping("search")
@RequiredArgsConstructor
@Slf4j
public class SearchController {

    @Value("${app.search.minTermLength:3}")
    private int minTermLength;

    @Value("${app.search.maxLimit:100}")
    private int maxLimit;

    private final Search.Service searchService;

    @GetMapping(value = "/quick", params = {"q", "limit"})
    public Mono<CombinedSearchResults> quickSearch(@RequestParam("q") String query, @RequestParam("limit") int limit) {
        log.info("quickSearch(query={}, limit={})", query, limit);
        // Maybe 422 instead of OK empty?
        if (query.length() < minTermLength) {
            return Mono.empty();
        }
        SearchRequest searchRequest = new SearchRequest(
            query,
            limit
        );
        return searchService.search(searchRequest);
    }
}
