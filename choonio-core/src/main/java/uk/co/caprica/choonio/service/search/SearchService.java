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

package uk.co.caprica.choonio.service.search;

import info.debatty.java.stringsimilarity.NGram;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.search.CombinedSearchResults;
import uk.co.caprica.choonio.api.model.search.SearchResult;
import uk.co.caprica.choonio.api.model.search.SearchResults;
import uk.co.caprica.choonio.service.search.model.SearchRequest;

import java.util.List;

import static uk.co.caprica.choonio.database.aggregations.SearchAggregations.searchAlbums;
import static uk.co.caprica.choonio.database.aggregations.SearchAggregations.searchArtists;
import static uk.co.caprica.choonio.database.aggregations.SearchAggregations.searchPlaylists;
import static uk.co.caprica.choonio.database.aggregations.SearchAggregations.searchTracks;

@Component
@RequiredArgsConstructor
@Slf4j
public class SearchService implements Search.Service {

    private final NGram stringSimilarity = new NGram(2);

    private final ReactiveMongoTemplate mongoTemplate;

    @Value("${app.search.maxLimit:100}")
    private int maxLimit;

    @Override
    public Mono<CombinedSearchResults> search(SearchRequest searchRequest) {
        log.info("search(searchRequest={})", searchRequest);
        String term = searchRequest.getQuery().toLowerCase();
        log.info("term={}", term);
        int maxResults = Math.min(searchRequest.getLimit(), maxLimit);
        log.info("maxResults={}", maxResults);
        return Mono.zip(
            searchResults(term, maxResults, searchArtists(term), Album.class, ArtistId.class),
            searchResults(term, maxResults, searchAlbums(term), Album.class, AlbumId.class),
            searchResults(term, maxResults, searchTracks(term), Album.class, TrackId.class),
            searchResults(term, maxResults, searchPlaylists(term), Playlist.class, PlaylistId.class)
        ).map(objects -> new CombinedSearchResults(
            term,
            searchRequest.getLimit(),
            objects.getT1(),
            objects.getT2(),
            objects.getT3(),
            objects.getT4()
        ));
    }

    private Mono<SearchResults> searchResults(String term, int maxResults, Aggregation aggregation, Class<?> collectionType, Class<? extends MediaId> outputType) {
        return mongoTemplate.aggregate(aggregation, collectionType, outputType)
            .map(mediaId -> new SearchResult(mediaId, score(mediaId, term)))
            .collectList()
            .map(list -> {
                list.sort((o1, o2) -> Float.compare(o2.getScore(), o1.getScore()));
                if (list.size() > maxResults) {
                    list = list.subList(0, maxResults);
                }
                return list;
            })
            .map(results -> new SearchResults(results.size(), results));
    }

    private float score(MediaId mediaId, String term) {
        log.debug("score(mediaId={}, term={})", mediaId, term);
        return 1 - (float) stringSimilarity.distance(mediaId.name().toLowerCase(), term);
    }
}
