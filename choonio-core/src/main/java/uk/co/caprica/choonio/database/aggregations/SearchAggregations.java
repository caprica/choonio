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

import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.playlists.Playlist;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.unwind;
import static org.springframework.data.mongodb.core.query.Criteria.where;

public final class SearchAggregations {

    private static final String CASE_INSENSITIVE_REGEX = "i";

    public static TypedAggregation<Album> searchArtists(String term) {
        return newAggregation(
            Album.class,
            match(
                where("mediaId.albumArtistName").regex(term, CASE_INSENSITIVE_REGEX)
            ),
            group().addToSet("mediaId.albumArtistName").as("artistName"),
            unwind("artistName"),
            project()
                .and("artistName").as("artistName")
        );
    }

    public static TypedAggregation<Album> searchAlbums(String term) {
        return newAggregation(
            Album.class,
            match(
                where("mediaId.albumName").regex(term, CASE_INSENSITIVE_REGEX)
            ),
            project()
                .and("mediaId.albumArtistName").as("albumArtistName")
                .and("mediaId.albumName").as("albumName")
        );
    }

    public static TypedAggregation<Album> searchTracks(String term) {
        return Aggregation.newAggregation(
            Album.class,
            project()
                .and("tracks.mediaId").as("mediaId"),
            unwind("mediaId"),
            match(
                where("mediaId.trackName").regex(term, CASE_INSENSITIVE_REGEX)
            ),
            project()
                .and("mediaId.albumArtistName").as("albumArtistName")
                .and("mediaId.albumName").as("albumName")
                .and("mediaId.trackName").as("trackName")
        );
    }

    public static TypedAggregation<Playlist> searchPlaylists(String term) {
        return Aggregation.newAggregation(
            Playlist.class,
            match(
                where("mediaId.playlistName").regex(term, CASE_INSENSITIVE_REGEX)
            ),
            project()
                .and("mediaId.playlistName").as("playlistName")
        );
    }

    private SearchAggregations() {
    }
}
