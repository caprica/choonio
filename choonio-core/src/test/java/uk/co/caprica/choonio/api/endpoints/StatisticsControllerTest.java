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

package uk.co.caprica.choonio.api.endpoints;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.plays.ArtistListenStats;
import uk.co.caprica.choonio.api.model.statistics.AlbumStatistics;
import uk.co.caprica.choonio.api.model.statistics.ArtistListenStatsResult;
import uk.co.caprica.choonio.api.model.statistics.ListenStatistics;
import uk.co.caprica.choonio.api.model.statistics.ListenStatsMeta;
import uk.co.caprica.choonio.service.statistics.Statistics;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = StatisticsController.class, properties = "spring.jackson.serialization.indent_output = true")
class StatisticsControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Statistics.Service statisticsService;

    @Test
    void itReturnsAlbumStatistics() {
        String expected = readJsonResource(getClass(), "get-album-statistics.json");
        when(statisticsService.getAlbumStatistics()).thenReturn(Mono.just(albumStatistics()));
        webTestClient.get()
            .uri("/api/statistics/albums")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsListenStatistics() {
        String expected = readJsonResource(getClass(), "get-listen-statistics.json");
        when(statisticsService.getListenStatistics()).thenReturn(Mono.just(
            new ListenStatistics(123, 456)
        ));
        webTestClient.get()
            .uri("/api/statistics/listens")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itReturnsListenStatisticsByArtistInPeriod() {
        String expected = readJsonResource(getClass(), "get-listen-statistics-by-artist-in-period.json");
        when(statisticsService.getListensByArtistForPeriod(eq(LocalDate.parse("2021-11-13")), eq(LocalDate.parse("2021-11-14")), any())).thenReturn(Mono.just(
            new ArtistListenStatsResult(
                new ListenStatsMeta(
                    3,
                    LocalDate.parse("2021-01-01"),
                    LocalDate.parse("2021-11-17")
                ),
                List.of(
                    new ArtistListenStats(new ArtistId("STRNGR & Destryur"), 752),
                    new ArtistListenStats(new ArtistId("Neon Nox"), 403),
                    new ArtistListenStats(new ArtistId("Ray Gun Hero"), 388)
                )
            )
        ));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/api/statistics/listens/by-artist")
                .queryParam("from", LocalDate.parse("2021-11-13"))
                .queryParam("to", LocalDate.parse("2021-11-14"))
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    private static AlbumStatistics albumStatistics() {
        return new AlbumStatistics(
            123,
            456,
            789,
            List.of(
                2020,
                2021
            ),
            List.of(
                "Synthwave",
                "Dance/Electronic"
            ),
            54321,
            2018,
            2021
        );
    }
}
