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
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.plays.Play;
import uk.co.caprica.choonio.api.model.ratings.Rating;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.api.model.transfer.DataExport;
import uk.co.caprica.choonio.api.model.transfer.DataImport;
import uk.co.caprica.choonio.api.model.transfer.DataType;
import uk.co.caprica.choonio.api.model.transfer.ImportMode;
import uk.co.caprica.choonio.service.transfer.Transfers;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static uk.co.caprica.choonio.test.TestResourceUtils.readJsonResource;

@WebFluxTest(controllers = TransfersController.class, properties = "spring.jackson.serialization.indent_output = true")
class TransfersControllerTest {

    @MockBean
    private Transfers.ExportService exportsService;

    @MockBean
    private Transfers.ImportService importsService;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void itReturnsExportsJson() {
        String expected = readJsonResource(getClass(), "get-exports.json");
        when(exportsService.exportData()).thenReturn(Mono.just(new DataExport(
            "1.0",
            List.of(
                new Favourite("1", new ArtistId("Dana Jean Phoenix"), Instant.parse("2020-04-24T10:20:30.456Z")),
                new Favourite("2", new AlbumId("DEADLIFE", "God in the Machine"), Instant.parse("2020-10-02T20:30:40.789Z"))
            ),
            List.of(),
            List.of(
                new Play("5", new TrackId("Oscillian", "Escape from Antarctica", "Shapeshifter"), Instant.parse("2021-04-24T12:11:10.987Z"))
            ),
            List.of(
                new Rating("6", new TrackId("Fury Weekend", "Escape from Neon City", "Sleepless Nights"), 1, Instant.parse("2021-03-15T18:19:20.890Z"))
            ),
            List.of(
                new Recent("3", new AlbumId("New Arcades", "In the Deepest of Dreams"), Instant.parse("2020-11-26T08:09:10.111Z"))
            ),
            Instant.parse("2021-10-16T12:34:56.789Z")
        )));
        webTestClient.get()
            .uri(uriBuilder -> uriBuilder.path("/api/transfer/export")
                .queryParam("filename", "export")
                .build()
            )
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus().isOk()
            .expectHeader().contentDisposition(
                ContentDisposition.builder("attachment")
                    .filename("export.json")
                    .build()
            )
            .expectBody().json(expected);
    }

    @Test
    void itImportsAllDataTypesFromJson() {
        String data = readJsonResource(getClass(), "get-exports.json");

        String expected = readJsonResource(getClass(), "post-all-imports.json");

        when(importsService.importData(any(), eq(new HashSet<>(Arrays.asList(DataType.allDataTypes()))), eq(ImportMode.REPLACE)))
            .thenReturn(Mono.just(
               new DataImport(2, 0, 1, 1, 1)
            ));

        webTestClient.post()
            .uri(uriBuilder -> uriBuilder.path("/api/transfer/import")
                .queryParam("mode", ImportMode.REPLACE)
                .build()
            )
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .bodyValue(data)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }

    @Test
    void itImportsDataTypesFromJson() {
        String data = readJsonResource(getClass(), "get-exports.json");

        String expected = readJsonResource(getClass(), "post-imports.json");

        when(importsService.importData(any(), eq(new HashSet<>(Arrays.asList(DataType.FAVOURITES, DataType.RECENTS))), eq(ImportMode.REPLACE)))
            .thenReturn(Mono.just(
                new DataImport(2, 0, 0, 0, 1)
            ));

        webTestClient.post()
            .uri(uriBuilder -> uriBuilder.path("/api/transfer/import")
                .queryParam("type", DataType.FAVOURITES)
                .queryParam("type", DataType.RECENTS)
                .queryParam("mode", ImportMode.REPLACE)
                .build()
            )
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .bodyValue(data)
            .exchange()
            .expectStatus().isOk()
            .expectBody().json(expected);
    }
}