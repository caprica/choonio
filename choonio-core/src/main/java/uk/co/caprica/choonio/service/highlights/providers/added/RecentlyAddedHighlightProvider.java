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

package uk.co.caprica.choonio.service.highlights.providers.added;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.highlights.HighlightProvider;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static uk.co.caprica.choonio.api.model.highlights.Highlight.newHighlight;

@Component
@ConditionalOnExpression("${app.highlights.providers.added.enabled:true}")
@RequiredArgsConstructor
@Slf4j
public class RecentlyAddedHighlightProvider implements HighlightProvider {

    private static final String HIGHLIGHT_TYPE = "Recently added";

    private static final String MESSAGE_FORMAT = "You added %s recently";

    private final Clock.Service clockService;

    private final ReactiveMongoTemplate mongoTemplate;

    @Value("${app.highlights.providers.added.days:14}")
    private int days;

    @Override
    public String getType() {
        return HIGHLIGHT_TYPE;
    }

    @Override
    public Flux<Highlight> getHighlights() {
        return mongoTemplate.aggregate(recentlyAddedAlbumHighlights(), Album.class)
            .map(album -> newHighlight(
                HIGHLIGHT_TYPE,
                String.format(MESSAGE_FORMAT, album.getMediaId().getAlbumName()),
                album.getMediaId(),
                null,
                null
            ));
    }

    private TypedAggregation<Album> recentlyAddedAlbumHighlights() {
        return Aggregation.newAggregation(Album.class,
            match(where("timestamp").gte(clockService.localDate().minusDays(days))),
            sort(Sort.Direction.DESC, "timestamp")
        );
    }
}
