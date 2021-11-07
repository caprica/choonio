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

package uk.co.caprica.choonio.database.aggregations;

import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import uk.co.caprica.choonio.api.model.albums.Album;

import static org.springframework.data.mongodb.core.aggregation.AccumulatorOperators.Max.maxOf;
import static org.springframework.data.mongodb.core.aggregation.AccumulatorOperators.Min.minOf;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.unwind;

public final class StatisticsAggregations {

    public static TypedAggregation<Album> albumStatistics() {
        return newAggregation(
            Album.class,
            unwind("tracks"),
            group()
                .addToSet("tracks.mediaId.albumArtistName")
                    .as("albumArtists")
                .addToSet("tracks.mediaId.albumName")
                    .as("albums")
                .addToSet("year")
                    .as("years")
                .addToSet("genre")
                    .as("genres")
                .count()
                    .as("tracks")
                .sum("tracks.duration")
                    .as("duration"),
            project("tracks", "duration", "years", "genres")
                .and("albumArtists")
                    .size()
                    .as("albumArtists")
                .and("albums")
                    .size()
                    .as("albums")
                .and(minOf("years"))
                    .as("fromYear")
                .and(maxOf("years"))
                    .as("toYear")
        );
    }

    private StatisticsAggregations() {
    }
}
