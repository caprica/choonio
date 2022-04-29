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
import uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration;
import uk.co.caprica.choonio.service.configuration.Configuration;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = ConfigurationController.class, properties = "spring.jackson.serialization.indent_output = true")
class ConfigurationControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Configuration.Service configurationService;

    @Test
    void itReturnsConfigurationJson() {
        String expected = readJsonResource(getClass(), "get-configuration.json");
        when(configurationService.getConfiguration()).thenReturn(Mono.just(configuration()));
        webTestClient.get()
            .uri("/api/configuration")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itUpdatesConfiguration() {
        ApplicationConfiguration configuration = configuration();
        webTestClient.put()
            .uri("/api/configuration")
            .contentType(MediaType.APPLICATION_JSON)
            .body(
                Mono.just(configuration),
                ApplicationConfiguration.class
            )
            .exchange()
            .expectStatus().isOk();
        verify(configurationService).updateConfiguration(eq(configuration));
    }

    private static ApplicationConfiguration configuration() {
        return new ApplicationConfiguration(
            "123",
            List.of(
                "/home/music1",
                "/home/music2"
            ),
            List.of(
                "mp3",
                "flac"
            ),
            "cover.jpg",
            true
        );
    }
}
