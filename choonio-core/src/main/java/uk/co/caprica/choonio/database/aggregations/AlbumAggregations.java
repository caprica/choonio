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

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import uk.co.caprica.choonio.api.model.albums.Album;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.replaceRoot;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sample;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.unwind;
import static org.springframework.data.mongodb.core.query.Criteria.where;

public final class AlbumAggregations {

    public static TypedAggregation<Album> artistTracks(String albumArtistName) {
        return newAggregation(
            Album.class,
            match(
                where("mediaId.albumArtistName")
                    .is(albumArtistName)
            ),
            sort(Sort.by(
                Sort.Direction.ASC, "year", "mediaId.albumName")
            ),
            unwind("tracks"),
            replaceRoot("tracks")
        );
    }

    public static TypedAggregation<Album> albumTracks(String albumArtistName, String albumName) {
        return newAggregation(
            Album.class,
            match(
                where("mediaId.albumArtistName")
                    .is(albumArtistName)
                .and("mediaId.albumName")
                    .is(albumName)
            ),
            unwind("tracks"),
            replaceRoot("tracks")
        );
    }

    public static TypedAggregation<Album> albumTrack(String albumArtistName, String albumName, String trackName) {
        return newAggregation(
            Album.class,
            match(
                where("mediaId.albumArtistName")
                    .is(albumArtistName)
                .and("mediaId.albumName")
                    .is(albumName)
            ),
            unwind("tracks"),
            replaceRoot("tracks"),
            match(
                where("mediaId.trackName")
                    .is(trackName)
            )
        );
    }

    public static TypedAggregation<Album> randomAlbumTracks(int howMany) {
        return newAggregation(
            Album.class,
            unwind("tracks"),
            replaceRoot("tracks"),
            sample(howMany)
        );
    }

    private AlbumAggregations() {
    }
}
