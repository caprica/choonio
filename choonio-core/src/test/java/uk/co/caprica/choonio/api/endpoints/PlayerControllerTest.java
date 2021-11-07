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
import uk.co.caprica.choonio.domain.RepeatMode;
import uk.co.caprica.choonio.domain.ShuffleMode;
import uk.co.caprica.choonio.domain.requests.PlayerActionRequest;
import uk.co.caprica.choonio.domain.requests.PlayerActionType;
import uk.co.caprica.choonio.mediaplayer.PlayerComponent;

import java.util.Map;

import static org.mockito.Mockito.verify;

@WebFluxTest(controllers = PlayerController.class, properties = "spring.jackson.serialization.indent_output = true")
class PlayerControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private PlayerComponent playerComponent;

    @Test
    void itInvokesPlay() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.PLAY,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).play();
    }

    @Test
    void itInvokesPause() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.PAUSE,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).pause();
    }

    @Test
    void itInvokesSkipNext() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.SKIP_NEXT,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).skipNext();
    }

    @Test
    void itInvokesSkipPrevious() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.SKIP_PREVIOUS,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).skipPrevious();
    }

    @Test
    void itInvokesSetPosition() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.SET_POSITION,
                    Map.of(
                        "position", "0.3f"
                    )
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).setPosition(0.3f);
    }

    @Test
    void itInvokesSetVolume() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.SET_VOLUME,
                    Map.of(
                        "volume", "85"
                    )
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).setVolume(85);
    }

    @Test
    void itInvokesMute() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.MUTE,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).mute();
    }

    @Test
    void itInvokesUnmute() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.UNMUTE,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).unmute();
    }

    @Test
    void itInvokesNoRepeat() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.REPEAT_NONE,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).repeat(RepeatMode.NO_REPEAT);
    }

    @Test
    void itInvokesRepeatOne() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.REPEAT_ONE,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).repeat(RepeatMode.REPEAT_ONE);
    }

    @Test
    void itInvokesRepeatAll() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.REPEAT_ALL,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).repeat(RepeatMode.REPEAT_ALL);
    }

    @Test
    void itInvokesShuffle() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.SHUFFLE_ON,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).shuffle(ShuffleMode.SHUFFLE);
    }

    @Test
    void itInvokesNoShuffle() {
        webTestClient.post()
            .uri("/api/player/controls")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(new PlayerActionRequest(
                    PlayerActionType.SHUFFLE_OFF,
                    null
                )),
                PlayerActionRequest.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(playerComponent).shuffle(ShuffleMode.NO_SHUFFLE);
    }
}
