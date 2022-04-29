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

package uk.co.caprica.choonio.service.highlights.providers.random;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.service.highlights.HighlightProvider;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.sample;
import static uk.co.caprica.choonio.api.model.highlights.Highlight.newHighlight;

@Component
@ConditionalOnExpression("${app.highlights.random.enabled:true}")
@Slf4j
public class AlbumRandomHighlightProvider implements HighlightProvider {

    private static final String HIGHLIGHT_TYPE = "Random";

    private static final String MESSAGE_FORMAT = "Feeling lucky album selection";

    private final ReactiveMongoTemplate mongoTemplate;

    @Value("${app.highlights.providers.random.sampleSize:10}")
    private int sampleSize;

    protected AlbumRandomHighlightProvider(ReactiveMongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public String getType() {
        return HIGHLIGHT_TYPE;
    }

    @Override
    public Flux<Highlight> getHighlights() {
        log.info("getHighlights");
        return mongoTemplate.aggregate(randomAlbumHighlights(), Album.class)
            .map(album -> newHighlight(
                HIGHLIGHT_TYPE,
                MESSAGE_FORMAT,
                album.getMediaId(),
                null,
                null
            ));
    }

    private TypedAggregation<Album> randomAlbumHighlights() {
        // A sample aggregation can return the same document more than once, but with a large enough size we can mostly
        // mitigate that to get a reasonable number of distinct random documents selected
        return Aggregation.newAggregation(Album.class,
            sample(sampleSize)
        );
    }
}
