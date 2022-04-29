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

package uk.co.caprica.choonio.service.highlights.providers.favourite;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.service.highlights.HighlightProvider;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static uk.co.caprica.choonio.api.model.highlights.Highlight.newHighlight;

@Slf4j
abstract public class FavouriteHighlightProvider implements HighlightProvider {

    private static final String HIGHLIGHT_TYPE = "Favourite";

    private static final String MESSAGE_FORMAT = "%s is a favourite %s";

    private final MediaType mediaType;

    private final ReactiveMongoTemplate mongoTemplate;

    protected FavouriteHighlightProvider(MediaType mediaType, ReactiveMongoTemplate mongoTemplate) {
        this.mediaType = mediaType;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public final String getType() {
        return HIGHLIGHT_TYPE;
    }

    @Override
    public final Flux<Highlight> getHighlights() {
        log.info("getHighlights");
        return mongoTemplate.aggregate(favouriteHighlights(mediaType), Favourite.class)
            .distinct(Favourite::getMediaId)
            .map(favourite -> newHighlight(
                HIGHLIGHT_TYPE,
                String.format(MESSAGE_FORMAT, favourite.getMediaId().name(), favourite.getMediaId().getType().toString().toLowerCase()),
                favourite.getMediaId(),
                null,
                null
            ));
    }

    private TypedAggregation<Favourite> favouriteHighlights(MediaType mediaType) {
        return Aggregation.newAggregation(Favourite.class,
            match(where("mediaId.type").is(mediaType))
        );
    }
}
