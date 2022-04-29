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

package uk.co.caprica.choonio.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mapping.context.MappingContext;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.index.ReactiveIndexOperations;
import org.springframework.data.mongodb.core.mapping.MongoPersistentEntity;
import org.springframework.data.mongodb.core.mapping.MongoPersistentProperty;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.api.model.recents.Recent;

import java.util.List;

/**
 * MongoDB initialisation to execute after the application itself has finished initialising.
 * <p>
 * Spring Data does not automatically create things like document indexes even if the classes are properly annotated,
 * so we create them explicitly here.
 * <p>
 * The database initialisation invokes blocking operations, but that is OK since it is a one-off during application
 * startup.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class MongoDbListener {

    /**
     * Collection of known document collection classes to process during initialisation.
     */
    private static final List<Class<?>> COLLECTION_CLASSES = List.of(
        Album.class,
        ApplicationConfiguration.class,
        Favourite.class,
        Highlight.class,
        Recent.class,
        Playlist.class,
        Play.class,
        Rating.class
    );

    private final ReactiveMongoTemplate mongoTemplate;

    /**
     * Startup method invoked after the Spring application context has finished initialising.
     * <p>
     * This method iterates the known document collection classes to ensure they are properly initialised in the
     * database (e.g. by creating the necessary indexes).
     * <p>
     * If the indexes are already present, index creation is skipped.
     */
    @EventListener(ContextRefreshedEvent.class)
    public void initialiseIndexes() {
        log.info("initialiseIndexes()");
        MappingContext<? extends MongoPersistentEntity<?>, MongoPersistentProperty> mappingContext = mongoTemplate.getConverter().getMappingContext();
        IndexResolver indexResolver = new MongoPersistentEntityIndexResolver(mappingContext);
        for (Class<?> collectionClass : COLLECTION_CLASSES) {
            log.info("collectionClass={}", collectionClass);
            ReactiveIndexOperations indexOps = mongoTemplate.indexOps(collectionClass);
            indexResolver.resolveIndexFor(collectionClass)
                .forEach(indexDefinition -> indexOps.ensureIndex(indexDefinition).block());
        }
    }
}
