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
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.ProjectionOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.plays.Play;

import java.time.LocalDate;

import static org.springframework.data.domain.Sort.Direction.ASC;
import static org.springframework.data.domain.Sort.Direction.DESC;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.limit;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.project;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.query.Criteria.where;

public final class PlayAggregations {

    public static TypedAggregation<Play> topArtistListensAggregation(int limit) {
        return newAggregation(
            Play.class,
            groupArtist(),
            projectArtist(),
            sortArtist(),
            limit(limit)
        );
    }

    public static TypedAggregation<Play> topArtistListensAggregation(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit) {
        return newAggregation(
            Play.class,
            matchTimestamp(fromDateInclusive, toDateExclusive),
            groupArtist(),
            projectArtist(),
            sortArtist(),
            limit(limit)
        );
    }

    public static TypedAggregation<Play> topAlbumListensAggregation(int limit) {
        return newAggregation(
            Play.class,
            groupAlbum(),
            projectAlbum(),
            sortAlbum(),
            limit(limit)
        );
    }

    public static TypedAggregation<Play> topAlbumListensAggregation(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit) {
        return newAggregation(
            Play.class,
            matchTimestamp(fromDateInclusive, toDateExclusive),
            groupAlbum(),
            projectAlbum(),
            sortAlbum(),
            limit(limit)
        );
    }

    public static TypedAggregation<Play> topTrackListensAggregation(int limit) {
        return newAggregation(
            Play.class,
            groupTrack(),
            projectTrack(),
            sortTrack(),
            limit(limit)
        );
    }

    public static TypedAggregation<Play> topTrackListensAggregation(LocalDate fromDateInclusive, LocalDate toDateExclusive, int limit) {
        return newAggregation(
            Play.class,
            matchTimestamp(fromDateInclusive, toDateExclusive),
            groupTrack(),
            projectTrack(),
            sortTrack(),
            limit(limit)
        );
    }

    public static TypedAggregation<Play> albumTrackListensAggregation(AlbumId albumIdentity) {
        return newAggregation(
            Play.class,
            matchAlbum(albumIdentity),
            groupTrack(),
            projectTrack()
        );
    }

    public static TypedAggregation<Play> listensMetaAggregation() {
        return newAggregation(
            Play.class,
            group()
                .count().as("listens")
                .min("timestamp").as("from")
                .max("timestamp").as("to")
        );
    }

    private static GroupOperation groupArtist() {
        return group("mediaId.albumArtistName")
            .count().as("listens");
    }

    private static GroupOperation groupAlbum() {
        return group("mediaId.albumArtistName", "mediaId.albumName")
            .count().as("listens");
    }

    private static GroupOperation groupTrack() {
        return group("mediaId.albumArtistName", "mediaId.albumName", "mediaId.trackName")
            .count().as("listens");
    }

    private static ProjectionOperation projectArtist() {
        return project()
            .and("mediaId.artistName").previousOperation()
            .and("listens").as("listens");
    }

    private static ProjectionOperation projectAlbum() {
        return project()
            .and("$albumArtistName").as("mediaId.albumArtistName")
            .and("$albumName").as("mediaId.albumName")
            .and("listens").as("listens")
            .andExclude("_id");
    }

    private static ProjectionOperation projectTrack() {
        return project()
            .and("$albumArtistName").as("mediaId.albumArtistName")
            .and("$albumName").as("mediaId.albumName")
            .and("$trackName").as("mediaId.trackName")
            .and("listens").as("listens")
            .andExclude("_id");
    }

    private static SortOperation sortArtist() {
        return sort(DESC, "listens")
            .and(ASC, "albumArtistName");
    }

    private static SortOperation sortAlbum() {
        return sort(DESC, "listens")
            .and(ASC, "albumName")
            .and(ASC, "albumArtistName");
    }

    private static SortOperation sortTrack() {
        return sort(DESC, "listens")
            .and(ASC, "trackName")
            .and(ASC, "albumName")
            .and(ASC, "albumArtistName");
    }

    private static MatchOperation matchTimestamp(LocalDate fromDateInclusive, LocalDate toDateExclusive) {
        return match(where("timestamp").gte(fromDateInclusive)
            .lt(toDateExclusive)
        );
    }

    private static MatchOperation matchAlbum(AlbumId albumIdentity) {
        return match(where("mediaId.albumArtistName").is(albumIdentity.getAlbumArtistName())
            .and("mediaId.albumName").is(albumIdentity.getAlbumName())
        );
    }

    private PlayAggregations() {
    }
}
