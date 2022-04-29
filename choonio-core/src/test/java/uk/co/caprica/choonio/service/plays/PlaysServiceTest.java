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

package uk.co.caprica.choonio.service.plays;

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
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.plays.AlbumListenStats;
import uk.co.caprica.choonio.api.model.plays.ArtistListenStats;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.plays.TrackListenStats;
import uk.co.caprica.choonio.database.repositories.PlaysRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlaysServiceTest {

    @Mock
    private Clock.Service clockService;

    @Mock
    private PlaysRepository playsRepository;

    @Mock
    private ServerSentEventManager eventManager;

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private PlaysService playsService;

    @Test
    void itCreatesPlay() {
        when(clockService.instant()).thenReturn(Instant.parse("2021-10-22T18:07:56.101Z"));

        TrackId track = new TrackId("W O L F C L U B", "Just Drive - Part 2", "Flashbacks");

        Play expectedPlay = new Play("1", track, Instant.parse("2021-10-22T18:07:56.101Z"));

        when(playsRepository.save(eq(new Play(null, track, Instant.parse("2021-10-22T18:07:56.101Z")))))
            .thenReturn(Mono.just(expectedPlay));

        Mono<Play> source = playsService.create("W O L F C L U B", "Just Drive - Part 2", "Flashbacks");
        StepVerifier.create(source)
            .expectNext(expectedPlay)
            .verifyComplete();

        verify(playsRepository).save(eq(new Play(null, track, Instant.parse("2021-10-22T18:07:56.101Z"))));

        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.PLAYS)));
    }

    @Test
    void itReturnsAllPlays() {
        Play play1 = new Play("1", new TrackId("Neon Nox", "Last Stand", "Recon"), Instant.parse("2021-10-14T12:34:56.789Z"));
        Play play2 = new Play("2", new TrackId("Ray Gun Hero", "Plethora", "I Didn't Know She Was an Android"), Instant.parse("2021-10-07T08:17:48.123Z"));

        TestPublisher<Play> publisher = TestPublisher.create();
        when(playsRepository.findAllByOrderByTimestampDesc()).thenReturn(publisher.flux());

        Flux<Play> source = playsService.getAllPlays();
        StepVerifier.create(source)
            .then(() -> publisher.emit(play1, play2))
            .expectNext(play1, play2)
            .verifyComplete();
    }

    @Test
    void itReturnsAlbumListens() {
        TrackId track1 = new TrackId("Various Artists", "Synth Massacre", "Unicorn Bones");
        TrackId track2 = new TrackId("Various Artists", "Synth Massacre", "Artifice");
        TrackId track3 = new TrackId("Various Artists", "Synth Massacre", "Haywire II");
        TrackId track4 = new TrackId("Various Artists", "Synth Massacre", "Hell on Wheels");
        TrackId track5 = new TrackId("Various Artists", "Synth Massacre", "Creeps in the House");

        when(mongoTemplate.aggregate(any(), eq(Play.class), eq(TrackListenStats.class))).thenReturn(Flux.fromIterable(
            List.of(
                new TrackListenStats(track1, 31),
                new TrackListenStats(track2, 27),
                new TrackListenStats(track3, 25),
                new TrackListenStats(track4, 25),
                new TrackListenStats(track5, 12)
            )
        ));

        Map<TrackId, TrackListenStats> expected = Map.of(
            track1, new TrackListenStats(track1, 31),
            track2, new TrackListenStats(track2, 27),
            track3, new TrackListenStats(track3, 25),
            track4, new TrackListenStats(track4, 25),
            track5, new TrackListenStats(track5, 12)
        );

        Mono<Map<TrackId, TrackListenStats>> source = playsService.getAlbumListens(new AlbumId("Various Artists", "Synth Massacre"));
        StepVerifier.create(source)
            .expectNext(expected)
            .verifyComplete();
    }

    @Test
    void itReturnsTopArtistListens() {
        ArtistListenStats stats1 = new ArtistListenStats(new ArtistId("Ray Gun Hero"), 154);
        ArtistListenStats stats2 = new ArtistListenStats(new ArtistId("Destryur"), 290);

        when(mongoTemplate.aggregate(any(), eq(Play.class), eq(ArtistListenStats.class)))
            .thenReturn(Flux.fromIterable(List.of(
                stats1,
                stats2
            )));

        Flux<ArtistListenStats> source = playsService.getTopArtistListens(2);
        StepVerifier.create(source)
            .expectNext(stats1, stats2)
            .verifyComplete();
    }

    @Test
    void itReturnsTopArtistListensInRange() {
        ArtistListenStats stats1 = new ArtistListenStats(new ArtistId("Ray Gun Hero"), 154);
        ArtistListenStats stats2 = new ArtistListenStats(new ArtistId("Destryur"), 290);

        when(mongoTemplate.aggregate(any(), eq(Play.class), eq(ArtistListenStats.class)))
            .thenReturn(Flux.fromIterable(List.of(
                stats1,
                stats2
            )));

        Flux<ArtistListenStats> source = playsService.getTopArtistListens(LocalDate.parse("2021-10-20"), LocalDate.parse("2021-10-26"), 2);
        StepVerifier.create(source)
            .expectNext(stats1, stats2)
            .verifyComplete();
    }

    @Test
    void itReturnsTopAlbumListens() {
        AlbumListenStats stats1 = new AlbumListenStats(new AlbumId("Ray Gun Hero", "Abandoned Sectors"), 154);
        AlbumListenStats stats2 = new AlbumListenStats(new AlbumId("Destryur", "Panic"), 290);

        when(mongoTemplate.aggregate(any(), eq(Play.class), eq(AlbumListenStats.class)))
            .thenReturn(Flux.fromIterable(List.of(
                stats1,
                stats2
            )));

        Flux<AlbumListenStats> source = playsService.getTopAlbumListens(2);
        StepVerifier.create(source)
            .expectNext(stats1, stats2)
            .verifyComplete();
    }

    @Test
    void itReturnsTopAlbumListensInRange() {
        AlbumListenStats stats1 = new AlbumListenStats(new AlbumId("Ray Gun Hero", "Abandoned Sectors"), 154);
        AlbumListenStats stats2 = new AlbumListenStats(new AlbumId("Destryur", "Panic"), 290);

        when(mongoTemplate.aggregate(any(), eq(Play.class), eq(AlbumListenStats.class)))
            .thenReturn(Flux.fromIterable(List.of(
                stats1,
                stats2
            )));

        Flux<AlbumListenStats> source = playsService.getTopAlbumListens(LocalDate.parse("2021-10-20"), LocalDate.parse("2021-10-26"), 2);
        StepVerifier.create(source)
            .expectNext(stats1, stats2)
            .verifyComplete();
    }

    @Test
    void itReturnsTopTrackListens() {
        TrackListenStats stats1 = new TrackListenStats(new TrackId("Ray Gun Hero", "Abandoned Sectors", "Security Breach"), 154);
        TrackListenStats stats2 = new TrackListenStats(new TrackId("Destryur", "Panic", "Death by Video"), 290);

        when(mongoTemplate.aggregate(any(), eq(Play.class), eq(TrackListenStats.class)))
            .thenReturn(Flux.fromIterable(List.of(
                stats1,
                stats2
            )));

        Flux<TrackListenStats> source = playsService.getTopTrackListens(2);
        StepVerifier.create(source)
            .expectNext(stats1, stats2)
            .verifyComplete();
    }

    @Test
    void itReturnsTopTrackListensInRange() {
        TrackListenStats stats1 = new TrackListenStats(new TrackId("Ray Gun Hero", "Abandoned Sectors", "Security Breach"), 154);
        TrackListenStats stats2 = new TrackListenStats(new TrackId("Destryur", "Panic", "Death by Video"), 290);

        when(mongoTemplate.aggregate(any(), eq(Play.class), eq(TrackListenStats.class)))
            .thenReturn(Flux.fromIterable(List.of(
                stats1,
                stats2
            )));

        Flux<TrackListenStats> source = playsService.getTopTrackListens(LocalDate.parse("2021-10-20"), LocalDate.parse("2021-10-26"), 2);
        StepVerifier.create(source)
            .expectNext(stats1, stats2)
            .verifyComplete();
    }
}
