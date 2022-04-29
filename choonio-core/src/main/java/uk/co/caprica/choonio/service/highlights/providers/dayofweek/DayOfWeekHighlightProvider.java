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

package uk.co.caprica.choonio.service.highlights.providers.dayofweek;

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

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Map;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.replaceRoot;
import static org.springframework.data.mongodb.core.aggregation.DateOperators.DayOfWeek.dayOfWeek;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static uk.co.caprica.choonio.api.model.highlights.Highlight.newHighlight;

@Slf4j
abstract class DayOfWeekHighlightProvider implements HighlightProvider {

    private static final String HIGHLIGHT_TYPE = "Day of week";

    private static final String MESSAGE_FORMAT = "You've listened to %s on %s";

    private static final Map<DayOfWeek, Integer> PERSISTENCE_VALUES = Map.of(
        DayOfWeek.MONDAY, 2,
        DayOfWeek.TUESDAY, 3,
        DayOfWeek.WEDNESDAY, 4,
        DayOfWeek.THURSDAY, 5,
        DayOfWeek.FRIDAY, 6,
        DayOfWeek.SATURDAY, 7,
        DayOfWeek.SUNDAY, 1
    );

    private final MediaType mediaType;

    private final Clock.Service clockService;

    private final ReactiveMongoTemplate mongoTemplate;

    protected DayOfWeekHighlightProvider(MediaType mediaType, Clock.Service clockService, ReactiveMongoTemplate mongoTemplate) {
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
        DayOfWeek day = DaysOfWeek.getDayOfWeek(clockService.localDate());
        log.info("day={}", day);
        return mongoTemplate.aggregate(dayOfWeekHighlights(mediaType, day), Recent.class)
            .distinct(Recent::getMediaId)
            .map(recent -> newHighlight(
                HIGHLIGHT_TYPE,
                String.format(MESSAGE_FORMAT, recent.getMediaId().name(), day.getDisplayName(TextStyle.FULL, Locale.getDefault())),
                recent.getMediaId(),
                null,
                null
            ));
    }

    private TypedAggregation<Recent> dayOfWeekHighlights(MediaType mediaType, DayOfWeek day) {
        Criteria criteria = new Criteria("dayOfWeek").is(PERSISTENCE_VALUES.get(day));
        return Aggregation.newAggregation(Recent.class,
            match(where("mediaId.type").is(mediaType)),
            project()
                .and(dayOfWeek("timestamp")).as("dayOfWeek")
                .and(Aggregation.ROOT).as("document"),
            match(criteria),
//            group("_id").first("$$ROOT").as("results"), this removes dupes
//            replaceRoot("results"),
            replaceRoot("document")
        );
    }
}
