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

package uk.co.caprica.choonio.service.highlights.providers.partofday;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.highlights.HighlightProvider;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.replaceRoot;
import static org.springframework.data.mongodb.core.aggregation.DateOperators.Hour.hourOf;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static uk.co.caprica.choonio.api.model.highlights.Highlight.newHighlight;

@Slf4j
abstract public class PartOfDayHighlightProvider implements HighlightProvider {

    private static final String HIGHLIGHT_TYPE = "Part of day";

    private static final String MESSAGE_FORMAT = "You've listened to %s in the %s";

    private final MediaType mediaType;

    private final Clock.Service clockService;

    private final ReactiveMongoTemplate mongoTemplate;

    protected PartOfDayHighlightProvider(MediaType mediaType, Clock.Service clockService, ReactiveMongoTemplate mongoTemplate) {
        this.mediaType = mediaType;
        this.clockService = clockService;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public final String getType() {
        return HIGHLIGHT_TYPE;
    }

    @Override
    public final Flux<Highlight> getHighlights() {
        log.info("getHighlights");
        PartOfDay partOfDay = PartOfDay.getPartOfDay(clockService.localTime());
        log.info("partOfDay={}", partOfDay);
        return mongoTemplate.aggregate(partOfDayHighlights(mediaType, partOfDay), Recent.class)
            .distinct(Recent::getMediaId)
            .map(recent -> newHighlight(
                HIGHLIGHT_TYPE,
                String.format(MESSAGE_FORMAT, recent.getMediaId().name(), partOfDay.toString().toLowerCase()),
                recent.getMediaId(),
                null,
                null
            ));
    }

    private TypedAggregation<Recent> partOfDayHighlights(MediaType mediaType, PartOfDay partOfDay) {
        Criteria criteria = new Criteria();
        switch (partOfDay) {
            case MORNING -> criteria.and("hour").lt(PartOfDay.AFTERNOON_HOUR);
            case AFTERNOON -> criteria.and("hour").gte(PartOfDay.AFTERNOON_HOUR).lt(PartOfDay.EVENING_HOUR);
            case EVENING -> criteria.and("hour").gte(PartOfDay.EVENING_HOUR);
        }
        return Aggregation.newAggregation(Recent.class,
            match(where("mediaId.type").is(mediaType)),
            project()
                .and(hourOf("timestamp")).as("hour")
                .and(Aggregation.ROOT).as("document"),
            match(criteria),
//            group("_id").first("$$ROOT").as("results"), this removes dupes
//            replaceRoot("results"),
            replaceRoot("document")
        );
    }
}
