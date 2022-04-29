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

package uk.co.caprica.choonio.service.configuration;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration;
import uk.co.caprica.choonio.database.repositories.ConfigurationRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;

import java.util.List;

import static java.util.Collections.emptyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConfigurationServiceTest {

    @Mock
    private ConfigurationRepository configurationRepository;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private ConfigurationService configurationService;

    @Test
    void itReturnsConfiguration() {
        ApplicationConfiguration configuration = new ApplicationConfiguration(
            "123",
            List.of(
                "/home/music1",
                "/home.music2"
            ),
            List.of(
                "mp3",
                "flac"
            ),
            "cover.jpg",
            true
        );

        TestPublisher<ApplicationConfiguration> publisher = TestPublisher.create();
        when(configurationRepository.findFirstBy()).thenReturn(publisher.mono());

        Mono<ApplicationConfiguration> source = configurationService.getConfiguration();
        StepVerifier.create(source)
            .then(() -> publisher.emit(configuration))
            .expectNext(configuration)
            .verifyComplete();
    }

    @Test
    void itReturnsDefaultConfiguration() {
        ReflectionTestUtils.setField(configurationService, "defaultCoverFilename", "cover.png");
        ReflectionTestUtils.setField(configurationService, "defaultMediaRoots", emptyList());
        ReflectionTestUtils.setField(configurationService, "defaultFileExtensions", List.of("mp3", "flac", "m4a"));
        ReflectionTestUtils.setField(configurationService, "defaultAlwaysExcludeThumbsDown", false);

        ApplicationConfiguration defaultConfiguration = new ApplicationConfiguration(
            null,
            emptyList(),
            List.of(
                "mp3",
                "flac",
                "m4a"
            ),
            "cover.png",
            false
        );

        when(configurationRepository.findFirstBy()).thenReturn(Mono.empty());

        Mono<ApplicationConfiguration> source = configurationService.getConfiguration();
        StepVerifier.create(source)
            .expectNext(defaultConfiguration)
            .verifyComplete();
    }

    @Test
    void itUpdatesConfiguration() {
        ApplicationConfiguration configuration = new ApplicationConfiguration(
            "123",
            List.of(
                "/home/music1",
                "/home.music2"
            ),
            List.of(
                "mp3",
                "flac"
            ),
            "cover.jpg",
            true
        );

        when(configurationRepository.deleteAll()).thenReturn(Mono.create(MonoSink::success));
        when(configurationRepository.save(eq(configuration))).thenReturn(Mono.just(configuration));

        Mono<Void> source = configurationService.updateConfiguration(configuration);
        StepVerifier.create(source)
            .verifyComplete();

        verify(configurationRepository).deleteAll();
        verify(configurationRepository).save(eq(configuration));
        verify(eventManager).emit(eq(new CollectionChanged(CollectionType.CONFIGURATION)));
    }
}