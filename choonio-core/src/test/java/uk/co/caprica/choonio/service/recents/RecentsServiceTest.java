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

package uk.co.caprica.choonio.service.recents;

import com.mongodb.client.result.DeleteResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.database.repositories.RecentsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecentsServiceTest {

    @Mock
    private RecentsRepository recentsRepository;

    @Mock
    private ServerSentEventManager eventManager;

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private RecentsService recentsService;

    @Test
    void itReturnsAllRecents() {
        Recent recent1 = new Recent("1", new ArtistId("Neon Nox"), Instant.parse("2021-10-14T12:34:56.789Z"));
        Recent recent2 = new Recent("2", new ArtistId("Ray Gun Hero"), Instant.parse("2021-10-07T08:17:48.123Z"));

        TestPublisher<Recent> publisher = TestPublisher.create();
        when(recentsRepository.findAllByOrderByTimestampDesc()).thenReturn(publisher.flux());

        Flux<Recent> source = recentsService.getAllRecents();
        StepVerifier.create(source)
            .then(() -> publisher.emit(recent1, recent2))
            .expectNext(recent1, recent2)
            .verifyComplete();
    }

    @Test
    void itReturnsRecentsOfAllTypesWithoutLimitWithoutDuplicates() {
        Recent recent1 = new Recent("1", new ArtistId("Neon Nox"), Instant.parse("2021-10-14T12:34:56.789Z"));
        Recent recent2 = new Recent("2", new ArtistId("Ray Gun Hero"), Instant.parse("2021-10-07T08:17:48.123Z"));
        Recent recent3 = new Recent("3", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-09-18T09:22:11.987Z"));
        Recent recent4 = new Recent("4", new ArtistId("Ray Gun Hero"), Instant.parse("2021-09-15T20:11:01.324Z"));
        Recent recent5 = new Recent("5", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-08-30T23:00:02.102Z"));
        Recent recent6 = new Recent("6", new TrackId("Neon Nox", "Syndicate Shadow", "Nightrider"), Instant.parse("2021-08-30T22:50:22.442Z"));
        Recent recent7 = new Recent("7", new AlbumId("Kalax", "Outlands"), Instant.parse("2021-07-13T14:24:59.980Z"));

        TestPublisher<Recent> publisher = TestPublisher.create();
        when(recentsRepository.findAllByOrderByTimestampDesc()).thenReturn(publisher.flux());

        Flux<Recent> source = recentsService.getRecents(null, null);
        StepVerifier.create(source)
            .then(() -> publisher.emit(recent1, recent2, recent3, recent4, recent5, recent6, recent7))
            .expectNext(recent1, recent2, recent3, recent6, recent7)
            .verifyComplete();

        verify(recentsRepository).findAllByOrderByTimestampDesc();
    }

    @Test
    void itReturnsRecentsOfAllTypesWithLimitWithoutDuplicates() {
        Recent recent1 = new Recent("1", new ArtistId("Neon Nox"), Instant.parse("2021-10-14T12:34:56.789Z"));
        Recent recent2 = new Recent("2", new ArtistId("Ray Gun Hero"), Instant.parse("2021-10-07T08:17:48.123Z"));
        Recent recent3 = new Recent("3", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-09-18T09:22:11.987Z"));
        Recent recent4 = new Recent("4", new ArtistId("Ray Gun Hero"), Instant.parse("2021-09-15T20:11:01.324Z"));
        Recent recent5 = new Recent("5", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-08-30T23:00:02.102Z"));
        Recent recent6 = new Recent("6", new TrackId("Neon Nox", "Syndicate Shadow", "Nightrider"), Instant.parse("2021-08-30T22:50:22.442Z"));
        Recent recent7 = new Recent("7", new AlbumId("Kalax", "Outlands"), Instant.parse("2021-07-13T14:24:59.980Z"));

        TestPublisher<Recent> publisher = TestPublisher.create();
        when(recentsRepository.findAllByOrderByTimestampDesc()).thenReturn(publisher.flux());

        Flux<Recent> source = recentsService.getRecents(null, 2);
        StepVerifier.create(source)
            .then(() -> publisher.emit(recent1, recent2, recent3, recent4, recent5, recent6, recent7))
            .expectNext(recent1, recent2)
            .verifyComplete();

        verify(recentsRepository).findAllByOrderByTimestampDesc();
    }

    @Test
    void itReturnsRecentsOfTypeWithoutLimitWithoutDuplicates() {
        Recent recent3 = new Recent("3", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-09-18T09:22:11.987Z"));
        Recent recent5 = new Recent("5", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-08-30T23:00:02.102Z"));
        Recent recent7 = new Recent("7", new AlbumId("Kalax", "Outlands"), Instant.parse("2021-07-13T14:24:59.980Z"));

        TestPublisher<Recent> publisher = TestPublisher.create();
        when(recentsRepository.findAllByMediaIdTypeOrderByTimestampDesc(eq(MediaType.ALBUM))).thenReturn(publisher.flux());

        Flux<Recent> source = recentsService.getRecents(MediaType.ALBUM, null);
        StepVerifier.create(source)
            .then(() -> publisher.emit(recent3, recent5, recent7))
            .expectNext(recent3, recent7)
            .verifyComplete();

        verify(recentsRepository).findAllByMediaIdTypeOrderByTimestampDesc(eq(MediaType.ALBUM));
    }

    @Test
    void itReturnsRecentsOfTypeWithLimitWithoutDuplicates() {
        Recent recent3 = new Recent("3", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-09-18T09:22:11.987Z"));
        Recent recent5 = new Recent("5", new AlbumId("Neon Nox", "Syndicate Shadow"), Instant.parse("2021-08-30T23:00:02.102Z"));
        Recent recent7 = new Recent("7", new AlbumId("Kalax", "Outlands"), Instant.parse("2021-07-13T14:24:59.980Z"));

        TestPublisher<Recent> publisher = TestPublisher.create();
        when(recentsRepository.findAllByMediaIdTypeOrderByTimestampDesc(eq(MediaType.ALBUM))).thenReturn(publisher.flux());

        Flux<Recent> source = recentsService.getRecents(MediaType.ALBUM, 1);
        StepVerifier.create(source)
            .then(() -> publisher.emit(recent3, recent5, recent7))
            .expectNext(recent3)
            .verifyComplete();

        verify(recentsRepository).findAllByMediaIdTypeOrderByTimestampDesc(eq(MediaType.ALBUM));
    }

    @Test
    void itAddsRecent() {
        Recent recentToAdd = new Recent(null, new ArtistId("Neon Nox"), Instant.parse("2021-10-14T12:34:56.789Z"));
        Recent addedRecent = new Recent("1", new ArtistId("Neon Nox"), Instant.parse("2021-10-14T12:34:56.789Z"));
        when(recentsRepository.save(eq(recentToAdd))).thenReturn(Mono.just(addedRecent));

        Mono<Recent> source = recentsService.addRecent(recentToAdd);
        StepVerifier.create(source)
            .expectNext(addedRecent)
            .verifyComplete();

        verify(recentsRepository).save(eq(recentToAdd));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.RECENTS)));
    }

    @Test
    void itRemovesRecent() {
        Recent recentToRemove = new Recent("1", new ArtistId("Neon Nox"), Instant.parse("2021-10-14T12:34:56.789Z"));
        when(recentsRepository.findById(eq("1"))).thenReturn(Mono.just(recentToRemove));
        when(mongoTemplate.remove(any(), eq(Recent.class))).thenReturn(Mono.just(DeleteResult.acknowledged(1)));

        Mono<Void> source = recentsService.removeRecent("1");
        StepVerifier.create(source)
            .verifyComplete();

        verify(mongoTemplate).remove(any(), eq(Recent.class));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.RECENTS)));
    }

    @Test
    void itDoesNotRemoveNotFoundRecent() {
        when(recentsRepository.findById(eq("1"))).thenReturn(Mono.empty());

        Mono<Void> source = recentsService.removeRecent("1");
        StepVerifier.create(source)
            .verifyComplete();

        verify(mongoTemplate, never()).remove(any(), eq(Recent.class));
        verify(eventManager, never()).emit(eq(new CollectionChanged(CollectionType.RECENTS)));
    }
}
