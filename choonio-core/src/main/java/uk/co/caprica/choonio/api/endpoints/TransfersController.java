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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.transfer.DataExport;
import uk.co.caprica.choonio.api.model.transfer.DataImport;
import uk.co.caprica.choonio.api.model.transfer.DataType;
import uk.co.caprica.choonio.api.model.transfer.ImportMode;
import uk.co.caprica.choonio.service.transfer.Transfers;

import java.util.Arrays;
import java.util.HashSet;

@RestController
@RequestMapping("transfer")
@RequiredArgsConstructor
@Slf4j
public class TransfersController {

    private static final String CONTENT_DISPOSITION_FORMAT = "attachment; filename=%s.json";

    private final Transfers.ExportService exportsService;
    private final Transfers.ImportService importService;

    @GetMapping("export")
    public Mono<DataExport> export(@RequestParam(value = "filename", required = false) String filename, ServerHttpResponse response) {
        setContentDisposition(filename, response);
        return exportsService.exportData();
    }

    @PostMapping("import")
    public Mono<DataImport> importData(@RequestBody Mono<DataExport> dataExport, @RequestParam(value = "type", required = false) DataType[] dataTypes, @RequestParam("mode") ImportMode mode) {
        if (dataTypes == null) {
            dataTypes = DataType.allDataTypes();
        }
        return importService.importData(dataExport, new HashSet<>(Arrays.asList(dataTypes)), mode);
    }

    private static void setContentDisposition(String filename, ServerHttpResponse response) {
        if (filename != null) {
            response.getHeaders().set(HttpHeaders.CONTENT_DISPOSITION, String.format(CONTENT_DISPOSITION_FORMAT, filename));
        }
    }
}
