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

package uk.co.caprica.choonio.service.transfer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.api.model.transfer.DataExport;
import uk.co.caprica.choonio.api.model.transfer.DataImport;
import uk.co.caprica.choonio.api.model.transfer.DataType;
import uk.co.caprica.choonio.api.model.transfer.ImportMode;
import uk.co.caprica.choonio.database.repositories.FavouritesRepository;
import uk.co.caprica.choonio.database.repositories.PlaylistsRepository;
import uk.co.caprica.choonio.database.repositories.PlaysRepository;
import uk.co.caprica.choonio.database.repositories.RatingsRepository;
import uk.co.caprica.choonio.database.repositories.RecentsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImportService implements Transfers.ImportService {

    private final FavouritesRepository favouritesRepository;
    private final RecentsRepository recentsRepository;
    private final PlaylistsRepository playlistsRepository;
    private final PlaysRepository playsRepository;
    private final RatingsRepository ratingsRepository;

    private final ServerSentEventManager eventManager;

    @Override
    public Mono<DataImport> importData(Mono<DataExport> dataExportMono, Set<DataType> dataTypes, ImportMode mode) {
        log.info("importData(dataTypes={}, mode={})", dataTypes, mode);
        return dataExportMono.flatMap(dataExport -> Mono.zip(
            importFavourites(dataExport.getFavourites(), dataTypes),
            importPlaylists(dataExport.getPlaylists(), dataTypes),
            importPlays(dataExport.getPlays(), dataTypes),
            importRatings(dataExport.getRatings(), dataTypes),
            importRecents(dataExport.getRecents(), dataTypes)
        )).map(imports -> new DataImport(
            imports.getT1(),
            imports.getT2(),
            imports.getT3(),
            imports.getT4(),
            imports.getT5()
        ));
    }

    private Mono<Long> importFavourites(List<Favourite> favourites, Set<DataType> dataTypes) {
        log.info("importFavourites(favourites=[{}], dataTypes={})", favourites.size(), dataTypes);
        if (dataTypes.contains(DataType.FAVOURITES)) {
            return favouritesRepository.deleteAll()
                .then(favouritesRepository.saveAll(favourites).count())
                .flatMap(count -> collectionChanged(CollectionType.FAVOURITES)
                    .thenReturn(count)
                );
        } else {
            return Mono.just(0L);
        }
    }

    private Mono<Long> importPlaylists(List<Playlist> playlists, Set<DataType> dataTypes) {
        if (dataTypes.contains(DataType.PLAYLISTS)) {
            return playlistsRepository.deleteAll()
                .then(playlistsRepository.saveAll(playlists).count())
                .flatMap(count -> collectionChanged(CollectionType.PLAYLISTS)
                    .thenReturn(count)
                );
        } else {
            return Mono.just(0L);
        }
    }

    private Mono<Long> importPlays(List<Play> plays, Set<DataType> dataTypes) {
        if (dataTypes.contains(DataType.PLAYS)) {
            return playsRepository.deleteAll()
                .then(playsRepository.saveAll(plays).count())
                .flatMap(count -> collectionChanged(CollectionType.PLAYS)
                    .thenReturn(count)
                );
        } else {
            return Mono.just(0L);
        }
    }

    private Mono<Long> importRatings(List<Rating> ratings, Set<DataType> dataTypes) {
        if (dataTypes.contains(DataType.RATINGS)) {
            return ratingsRepository.deleteAll()
                .then(ratingsRepository.saveAll(ratings).count())
                .flatMap(count -> collectionChanged(CollectionType.RATINGS)
                    .thenReturn(count)
                );
        } else {
            return Mono.just(0L);
        }
    }

    private Mono<Long> importRecents(List<Recent> recents, Set<DataType> dataTypes) {
        if (dataTypes.contains(DataType.RECENTS)) {
            return recentsRepository.deleteAll()
                .then(recentsRepository.saveAll(recents).count())
                .flatMap(count -> collectionChanged(CollectionType.RECENTS)
                    .thenReturn(count)
                );
        } else {
            return Mono.just(0L);
        }
    }

    private Mono<Void> collectionChanged(CollectionType collectionType) {
        log.info("collectionChanged(collectionType={})", collectionType);
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(collectionType));
            return Mono.create(MonoSink::success);
        });
    }
}
