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
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.addFields;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.limit;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.replaceRoot;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.unwind;
import static org.springframework.data.mongodb.core.aggregation.ArrayOperators.IndexOfArray.arrayOf;
import static org.springframework.data.mongodb.core.aggregation.UnsetOperation.unset;
import static org.springframework.data.mongodb.core.query.Criteria.where;

public final class ArtAggregations {

    public static TypedAggregation<Album> artistArtLocation(String albumArtistName) {
        return newAggregation(
            Album.class,
            match(where("mediaId.albumArtistName")
                .is(albumArtistName)
            ),
            sort(Sort.by(Sort.Direction.DESC, "year"))
                .and(Sort.Direction.ASC, "mediaId.albumName"),
            limit(1),
            project("location")
        );
    }

    public static TypedAggregation<Album> albumArtLocation(AlbumId albumId) {
        return newAggregation(
            Album.class,
            match(where("mediaId")
                .is(albumId)
            ),
            project("location")
        );
    }

    public static TypedAggregation<Album> albumArtLocations(List<AlbumId> albumIds) {
        return newAggregation(
            Album.class,
            match(where("mediaId")
                .in(albumIds)
            ),
            // Use a pseudo index field to sort the results in the same order as the in clause
            addFields()
                .addField("index")
                .withValue(arrayOf(albumIds).indexOf("$mediaId"))
                .build(),
            sort(Sort.Direction.ASC, "index"),
            project("location")
        );
    }

    /**
     *
     * <p>
     * This is essentially a wrapped call to {@link #albumArtLocation(AlbumId)}.
     *
     * @param trackId
     * @return
     */
    public static TypedAggregation<Album> trackArtLocation(TrackId trackId) {
        return albumArtLocation(trackId.albumId());
    }

    /**
     * Given a playlist name, find the most common unique artist and album combinations from the tracks in that
     * playlist, up to a given limit.
     *
     * @param playlistName name of the playlist
     * @param limit maximum number of results to return
     * @return result-set of unique album identities (artist name and album name) ordered by most commonly occurring
     */
    public static TypedAggregation<Playlist> mostCommonAlbumsInPlaylist(String playlistName, int limit) {
        return newAggregation(
            Playlist.class,
            match(where("mediaId.playlistName")
                .is(playlistName)
            ),
            project()
                .and("items.mediaId")
                .as("mediaId"),
            unset("mediaId.trackName"),
            unwind("mediaId"),
            group("mediaId")
                .count()
                .as("count"),
            sort(Sort.Direction.DESC, "count"),
            replaceRoot("_id"),
            limit(limit)
        );
    }
}
