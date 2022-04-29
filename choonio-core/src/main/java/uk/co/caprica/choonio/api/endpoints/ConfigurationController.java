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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration;
import uk.co.caprica.choonio.service.configuration.Configuration;

@RestController
@RequestMapping("configuration")
@RequiredArgsConstructor
@Slf4j
public class ConfigurationController {

    private final Configuration.Service configurationService;

    @GetMapping
    public Mono<ApplicationConfiguration> getCurrentConfiguration() {
        log.info("getCurrentStatus()");
        return configurationService.getConfiguration();
    }

    @PutMapping
    public Mono<Void> updateConfiguration(@RequestBody ApplicationConfiguration newConfiguration) {
        log.info("updateConfiguration(newConfiguration={})", newConfiguration);
        return configurationService.updateConfiguration(newConfiguration);
    }
}
