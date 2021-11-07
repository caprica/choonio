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

package uk.co.caprica.choonio.service.statistics;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.statistics.AlbumStatistics;
import uk.co.caprica.choonio.api.model.statistics.ListenStatistics;
import uk.co.caprica.choonio.database.repositories.AlbumsRepository;
import uk.co.caprica.choonio.database.repositories.PlaysRepository;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceTest {

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @Mock
    private AlbumsRepository albumsRepository;

    @Mock
    private PlaysRepository playsRepository;

    @InjectMocks
    private StatisticsService statisticsService;

    @Test
    void itReturnsAlbumStatistics() {
        AlbumStatistics albumStatistics = new AlbumStatistics(
            3,
            5,
            28,
            List.of(2020, 2021),
            List.of("Synthwave", "Dance/Electronic"),
            155,
            2020,
            2021
        );

        when(mongoTemplate.aggregate(any(), eq(AlbumStatistics.class)))
            .thenReturn(Flux.just(albumStatistics));

        Mono<AlbumStatistics> source = statisticsService.getAlbumStatistics();
        StepVerifier.create(source)
            .expectNext(albumStatistics)
            .verifyComplete();
    }

    @Test
    void itReturnsListenStatistics() {
        ListenStatistics listenStatistics = new ListenStatistics(
            3,
            793
        );

        when(playsRepository.findAll())
            .thenReturn(Flux.fromIterable(
                List.of(
                    new Play("1", new TrackId("GUNSHIP", "GUNSHIP", "Fly For Your Life"), Instant.parse("2021-10-26T12:01:02.034Z")),
                    new Play("2", new TrackId("Cassetter", "Entropy", "The Haunted Train"), Instant.parse("2021-10-26T14:52:21.114Z")),
                    new Play("3", new TrackId("NINA", "Synthian", "The Wire"), Instant.parse("2021-10-26T14:56:03.808Z"))
                )
            ));

        when(albumsRepository.findByMediaId(eq(new AlbumId("GUNSHIP", "GUNSHIP"))))
            .thenReturn(Mono.just(new Album(
                "101",
                new AlbumId("GUNSHIP", "GUNSHIP"),
                null,
                null,
                List.of(
                    new AlbumTrack(
                        new TrackId("GUNSHIP", "GUNSHIP", "Fly For Your Life"),
                        1,
                        "GUNSHIP",
                        279,
                        null,
                        null
                    )
                ),
                0,
                null,
                null,
                null
            )));

        when(albumsRepository.findByMediaId(eq(new AlbumId("Cassetter", "Entropy"))))
            .thenReturn(Mono.just(new Album(
                "202",
                new AlbumId("Cassetter", "Entropy"),
                null,
                null,
                List.of(
                    new AlbumTrack(
                        new TrackId("Cassetter", "Entropy", "The Haunted Train"),
                        1,
                        "Cassetter",
                        296,
                        null,
                        null
                    )
                ),
                0,
                null,
                null,
                null
            )));

        when(albumsRepository.findByMediaId(eq(new AlbumId("NINA", "Synthian"))))
            .thenReturn(Mono.just(new Album(
                "101",
                new AlbumId("NINA", "Synthian"),
                null,
                null,
                List.of(
                    new AlbumTrack(
                        new TrackId("NINA", "Synthian", "The Wire"),
                        1,
                        "The Wire",
                        218,
                        null,
                        null
                    )
                ),
                0,
                null,
                null,
                null
            )));

        Mono<ListenStatistics> source = statisticsService.getListenStatistics();
        StepVerifier.create(source)
            .expectNext(listenStatistics)
            .verifyComplete();
    }
}
