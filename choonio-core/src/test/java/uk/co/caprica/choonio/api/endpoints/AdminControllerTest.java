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

import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import uk.co.caprica.choonio.service.catalog.Catalog;

import static org.mockito.Mockito.verify;

@WebFluxTest(controllers = AdminController.class, properties = "spring.jackson.serialization.indent_output = true")
class AdminControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private Catalog.Service catalogService;

    @Test
    @SneakyThrows
    void itUpdatesConfiguration() {
        webTestClient.post()
            .uri("/api/admin/catalog")
            .exchange()
            .expectStatus().isOk();
        verify(catalogService).loadLibrary();
    }
}
