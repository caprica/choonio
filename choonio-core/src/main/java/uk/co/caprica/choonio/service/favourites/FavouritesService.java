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

package uk.co.caprica.choonio.service.favourites;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.database.repositories.FavouritesRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.clock.Clock;

import static org.springframework.data.mongodb.core.query.Query.query;
import static uk.co.caprica.choonio.api.model.favourites.Favourite.newFavourite;
import static uk.co.caprica.choonio.database.criteria.MediaIdCriteria.mediaIdCriteria;

@Service
@RequiredArgsConstructor
@Slf4j
public class FavouritesService implements Favourites.Service {

    private final Clock.Service clockService;

    private final FavouritesRepository favouritesRepository;

    private final ReactiveMongoTemplate mongoTemplate;

    private final ServerSentEventManager eventManager;

    @Override
    public Flux<Favourite> getFavourites() {
        log.info("getFavourites()");
        return favouritesRepository.findAllByOrderByTimestampDesc();
    }

    @Override
    public Mono<Void> addToFavourites(MediaId mediaId) {
        log.info("addToFavourites(mediaId={})", mediaId);
        return findFavourite(mediaId)
            .defaultIfEmpty(newFavourite(mediaId, null))
            .map(favourite -> favourite.withTimestamp(clockService.instant()))
            .flatMap(favouritesRepository::save)
            .then(favouritesChanged());
    }

    /**
     * Find a matching favourite if one already exists.
     *
     * @param mediaId unique media identifier describing the favourite to find
     * @return existing favourite, if one exists
     */
    private Mono<Favourite> findFavourite(MediaId mediaId) {
        log.info("findFavourite(mediaId={})", mediaId);
        Criteria criteria = mediaIdCriteria(mediaId);
        return mongoTemplate.findOne(query(criteria), Favourite.class);
    }

    @Override
    public Mono<Void> removeFavourite(String id) {
        log.info("removeFavourite(id={})", id);
        return favouritesRepository.deleteById(id)
            .then(favouritesChanged());
    }

    @Override
    public Mono<Void> removeAllFavourites() {
        log.info("removeAllFavourites()");
        return favouritesRepository.deleteAll()
            .then(favouritesChanged());
    }

    private Mono<Void> favouritesChanged() {
        log.info("favouritesChanged()");
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(CollectionType.FAVOURITES));
            return Mono.create(MonoSink::success);
        });
    }
}
