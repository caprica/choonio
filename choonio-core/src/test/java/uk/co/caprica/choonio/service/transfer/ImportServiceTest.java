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

package uk.co.caprica.choonio.service.transfer;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
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

import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptySet;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImportServiceTest {

    @Mock
    private FavouritesRepository favouritesRepository;

    @Mock
    private RecentsRepository recentsRepository;

    @Mock
    private PlaylistsRepository playlistsRepository;

    @Mock
    private PlaysRepository playsRepository;

    @Mock
    private RatingsRepository ratingsRepository;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private ImportService importService;

    @Test
    void itImportsAndReplacesAllTypes() {
        DataExport dataExport = dataExport();

        when(favouritesRepository.deleteAll()).thenReturn(Mono.create(MonoSink::success));
        when(playlistsRepository.deleteAll()).thenReturn(Mono.create(MonoSink::success));
        when(playsRepository.deleteAll()).thenReturn(Mono.create(MonoSink::success));
        when(ratingsRepository.deleteAll()).thenReturn(Mono.create(MonoSink::success));
        when(recentsRepository.deleteAll()).thenReturn(Mono.create(MonoSink::success));

        when(favouritesRepository.saveAll(anyList())).thenReturn(Flux.fromIterable(dataExport.getFavourites()));
        when(playlistsRepository.saveAll(anyList())).thenReturn(Flux.fromIterable(dataExport.getPlaylists()));
        when(playsRepository.saveAll(anyList())).thenReturn(Flux.fromIterable(dataExport.getPlays()));
        when(ratingsRepository.saveAll(anyList())).thenReturn(Flux.fromIterable(dataExport.getRatings()));
        when(recentsRepository.saveAll(anyList())).thenReturn(Flux.fromIterable(dataExport.getRecents()));

        Mono<DataImport> source = importService.importData(Mono.just(dataExport), new HashSet<>(Arrays.asList(DataType.allDataTypes())), ImportMode.REPLACE);
        StepVerifier.create(source)
            .expectNext(new DataImport(3, 1, 1, 1, 2))
            .verifyComplete();

        verify(favouritesRepository).saveAll(anyList());
        verify(playlistsRepository).saveAll(anyList());
        verify(playsRepository).saveAll(anyList());
        verify(ratingsRepository).saveAll(anyList());
        verify(recentsRepository).saveAll(anyList());

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.FAVOURITES)));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.PLAYLISTS)));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.PLAYS)));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.RATINGS)));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.RECENTS)));
    }

    @Test
    void itSkipsImportsByType() {
        DataExport dataExport = dataExport();

        Mono<DataImport> source = importService.importData(Mono.just(dataExport), emptySet(), ImportMode.REPLACE);
        StepVerifier.create(source)
            .expectNext(new DataImport(0, 0, 0, 0, 0))
            .verifyComplete();

        verify(eventManager, never()).emit(any(CollectionChanged.class));
    }

    private static DataExport dataExport() {
        return new DataExport(
            "1.0",
            List.of(
                new Favourite("10", new ArtistId("Magic Sword"), Instant.parse("2021-10-15T10:10:10.100Z")),
                new Favourite("11", new AlbumId("Static Movement", "Simin"), Instant.parse("2021-10-16T11:11:11.110Z")),
                new Favourite("12", new TrackId("Destryur", "Midnight Maniac", "Club Heartbreak"), Instant.parse("2021-10-17T12:12:12.120Z"))
            ),
            List.of(
                new Playlist("31", new PlaylistId("Only Synthwave"), "The best genre", emptyList(), 1234, Instant.parse("2021-08-15T12:00:01.111Z"), Instant.parse("2021-08-15T12:00:01.111Z"))
            ),
            List.of(
                new Play("41", new TrackId("New Arcades", "In the Deepest of Dreams", "Don't Stop Dreaming"), Instant.parse("2021-09-24T13:33:30.303Z"))
            ),
            List.of(
                new Rating("51", new TrackId("Fury Weekend", "Escape from Neon City", "Thousand Lights"), 1, Instant.parse("2021-10-03T14:44:40.404Z"))
            ),
            List.of(
                new Recent("20", new ArtistId("Magic Sword"), Instant.parse("2021-10-20T08:08:08.800Z")),
                new Recent("21", new TrackId("DEADLIFE", "God in the Machine", "Call Me DL"), Instant.parse("2021-10-11T09:09:09.900Z"))
            ),
            Instant.parse("2021-10-22T12:34:56.789Z")
        );
    }
}