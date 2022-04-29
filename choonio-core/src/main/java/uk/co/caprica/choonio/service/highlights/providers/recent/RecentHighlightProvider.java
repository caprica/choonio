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

package uk.co.caprica.choonio.service.highlights.providers.recent;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.highlights.HighlightProvider;

import java.time.LocalDate;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static uk.co.caprica.choonio.api.model.highlights.Highlight.newHighlight;

@Slf4j
abstract public class RecentHighlightProvider implements HighlightProvider {

    private static final String HIGHLIGHT_TYPE = "Recent";

    private static final String MESSAGE_FORMAT = "You've listened to %s recently";

    private final MediaType mediaType;

    private final Clock.Service clockService;

    private final ReactiveMongoTemplate mongoTemplate;

    @Value("${app.highlights.providers.recent.recentDays:30}")
    private int recentDays;

    protected RecentHighlightProvider(MediaType mediaType, Clock.Service clockService, ReactiveMongoTemplate mongoTemplate) {
        this.mediaType = mediaType;
        this.clockService = clockService;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public String getType() {
        return HIGHLIGHT_TYPE;
    }

    @Override
    public Flux<Highlight> getHighlights() {
        log.info("getHighlights");
        return mongoTemplate.aggregate(recentHighlights(mediaType), Recent.class)
            .distinct(Recent::getMediaId)
            .map(recent -> newHighlight(
                HIGHLIGHT_TYPE,
                String.format(MESSAGE_FORMAT, recent.getMediaId().name()),
                recent.getMediaId(),
                null,
                null
            ));
    }

    private TypedAggregation<Recent> recentHighlights(MediaType mediaType) {
        LocalDate earliestDate = clockService.localDate().minusDays(recentDays);
        return Aggregation.newAggregation(Recent.class,
            match(
                where("mediaId.type").is(mediaType)
                    .and("timestamp").gte(earliestDate)
            ),
            sort(Sort.Direction.DESC, "timestamp")
        );
    }
}
