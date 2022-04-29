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

package uk.co.caprica.choonio.database.aggregations;

import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import uk.co.caprica.choonio.api.model.albums.Album;

import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.aggregation.ArrayOperators.Size.lengthOfArray;
import static org.springframework.data.mongodb.core.query.Criteria.where;

public final class ArtistAggregations {

    public static TypedAggregation<Album> artistSummaries() {
        return newAggregation(
            Album.class,
            groupArtistSummary(),
            projectArtistSummary(),
            sortArtistSummary()
        );
    }

    public static TypedAggregation<Album> artistSummariesForGenre(String genre) {
        return newAggregation(
            Album.class,
            match(where("genre").is(genre)),
            groupArtistSummary(),
            projectArtistSummary(),
            sortArtistSummary()
        );
    }

    private static GroupOperation groupArtistSummary() {
        return group("mediaId.albumArtistName")
            .count()
                .as("albums")
            .sum(lengthOfArray("tracks"))
                .as("tracks")
            .sum("duration")
                .as("duration");
    }

    private static ProjectionOperation projectArtistSummary() {
        return project()
            .and("mediaId.type")
                .asLiteral()
                .as("ALBUM")
            .and("mediaId.artistName")
                .previousOperation()
            .and("albums")
                .as("albums")
            .and("tracks")
                .as("tracks")
            .and("duration")
                .as("duration");
    }

    private static SortOperation sortArtistSummary() {
        return sort(ASC, "artistName");
    }

    private ArtistAggregations() {
    }
}
