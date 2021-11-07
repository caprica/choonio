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

package uk.co.caprica.choonio.service.configuration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration;
import uk.co.caprica.choonio.database.repositories.ConfigurationRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;

import java.util.List;

import static uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration.applicationConfiguration;

@Service
@RequiredArgsConstructor
@Slf4j
@CacheConfig(cacheNames = "configuration")
public class ConfigurationService implements Configuration.Service {

    private final ConfigurationRepository configurationRepository;

    private final ServerSentEventManager eventManager;

    @Value("${app.library.defaultCoverFilename:cover.jpg}")
    private String defaultCoverFilename;

    @Value("${app.library.defaultMediaRoots:}")
    private List<String> defaultMediaRoots;

    @Value("${app.library.defaultFileExtensions:mp3,flac,m4a}")
    private List<String> defaultFileExtensions;

    @Value("${app.library.defaultAlwaysExcludeThumgsDown:false}")
    private boolean defaultAlwaysExcludeThumbsDown;

    @Override
    @Cacheable
    public Mono<ApplicationConfiguration> getConfiguration() {
        log.info("getConfiguration()");
        return configurationRepository.findFirstBy()
            .switchIfEmpty(Mono.just(defaultConfiguration()));
    }

    @Override
    @CacheEvict(allEntries = true)
    public Mono<Void> updateConfiguration(ApplicationConfiguration newConfiguration) {
        log.info("updateConfiguration(newConfiguration={})", newConfiguration);
        return configurationRepository.deleteAll()
            .then(configurationRepository.save(newConfiguration))
            .then(configurationChanged());
    }

    private ApplicationConfiguration defaultConfiguration() {
        return applicationConfiguration(
            defaultMediaRoots,
            defaultFileExtensions,
            defaultCoverFilename,
            defaultAlwaysExcludeThumbsDown
        );
    }

    private Mono<Void> configurationChanged() {
        log.info("configurationChanged()");
        return Mono.defer(() -> {
            log.info("xxx");
            eventManager.emit(new CollectionChanged(CollectionType.CONFIGURATION));
            return Mono.create(MonoSink::success);
        });
    }
}
