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

package uk.co.caprica.choonio.api.endpoints;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.api.model.queue.QueueMode;
import uk.co.caprica.choonio.api.model.request.AddToQueueRequest;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.choonio.service.queue.Queue;
import uk.co.caprica.choonio.service.ratings.Ratings;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = QueueController.class, properties = "spring.jackson.serialization.indent_output = true")
class QueueControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Queue.Service queueService;

    @MockBean
    private Plays.Service playsService;

    @MockBean
    private Ratings.Service ratingsService;

    @Test
    void itReturnsQueueJson() {
        String expected = readJsonResource(getClass(), "get-queue.json");
        Playlist scenario = getScenario();
        when(queueService.getQueue()).thenReturn(Mono.just(scenario));
        webTestClient.get()
            .uri("/api/queue")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itAddsToQueue() {
        AddToQueueRequest request = new AddToQueueRequest(
            new AlbumId("NINA", "Synthian"),
            QueueMode.ADD,
            true
        );
        webTestClient.put()
            .uri("/api/queue")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(request),
                AddToQueueRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(queueService).addToQueue(eq(new AlbumId("NINA", "Synthian")), eq(QueueMode.ADD), eq(true));
    }

    @Test
    void itClearsQueue() {
        webTestClient.delete()
            .uri("/api/queue")
            .exchange()
            .expectStatus().isOk();
        verify(queueService).clearQueue();
    }

    private static Playlist getScenario() {
        return new Playlist(
            "1",
            new PlaylistId("Queue"),
            "Play queue",
            List.of(new PlaylistItem(
                "101",
                new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
                null
            )),
            8916,
            Instant.parse("2021-09-01T05:05:05.555Z"),
            Instant.parse("2021-09-02T06:06:06.666Z")
        );
    }
}
