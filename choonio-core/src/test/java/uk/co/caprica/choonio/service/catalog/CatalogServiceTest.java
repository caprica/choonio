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

package uk.co.caprica.choonio.service.catalog;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration;
import uk.co.caprica.choonio.database.repositories.AlbumsRepository;
import uk.co.caprica.choonio.domain.ApplicationStatus;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.StatusChanged;
import uk.co.caprica.choonio.service.art.ArtService;
import uk.co.caprica.choonio.service.configuration.Configuration;

import java.io.File;
import java.nio.file.Path;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CatalogServiceTest {

    private static final Path mediaRoot = Path.of(
        "src/test/resources",
        CatalogServiceTest.class.getPackageName().replaceAll("\\.", File.separator),
        "media-root"
    );

    @Mock
    private Configuration.Service configurationService;

    @Mock
    private MetaErrors metaErrors;

    @Mock
    private AlbumsRepository albumsRepository;

    @Mock
    private ArtService artService;

    @Mock
    private ServerSentEventManager eventManager;

    @InjectMocks
    private CatalogService catalogService;

    @Test
    void itGeneratesMediaLibrary() {
        when(configurationService.getConfiguration())
            .thenReturn(Mono.just(new ApplicationConfiguration(
                "1",
                List.of(mediaRoot.toString()),
                List.of("mp3"),
                "cover.jpg",
                false
            )));

        doNothing().when(metaErrors).saveMetaErrors(any());

        when(albumsRepository.deleteAll()).thenReturn(Mono.create(MonoSink::success));
        when(albumsRepository.saveAll(ArgumentMatchers.<Iterable<Album>>any())).thenReturn(Flux.empty());

        Mono<Void> source = catalogService.loadLibrary();
        StepVerifier.create(source)
            .verifyComplete();

        verify(eventManager).emit(eq(new StatusChanged(ApplicationStatus.SEARCH_MEDIA)));
    }
}
