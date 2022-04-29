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

package uk.co.caprica.choonio.service.art;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.art.ArtSize;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.database.model.values.Location;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Path;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArtServiceTest {

    private static final Path artRoot = Path.of(
        "src/test/resources",
        ArtServiceTest.class.getPackageName().replaceAll("\\.", File.separator),
        "art-root"
    );

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private ArtService artService;

    @BeforeEach
    void beforeEach() {
        ReflectionTestUtils.setField(artService, "artCacheDirectory", artRoot.toString());
        ReflectionTestUtils.setField(artService, "sourceCoverFilename", "cover.jpg");
        ReflectionTestUtils.setField(artService, "imageFormat", "jpg");
        artService.postConstruct();
    }

    @Test
    void itReturnsArtistImage() {
        when(mongoTemplate.aggregate(any(), eq(Location.class)))
            .thenReturn(Flux.just(new Location(albumArtPath("Artist1", "Album1"))));

        Mono<BufferedImage> source = artService.getImage(new ArtistId("Artist1"), ArtSize.MEDIUM);
        StepVerifier.create(source)
            .expectNextCount(1)
            .verifyComplete();
    }

    @Test
    void itReturnsAlbumImage() {
        when(mongoTemplate.aggregate(any(), eq(Location.class)))
            .thenReturn(Flux.just(new Location(albumArtPath("Artist1", "Album1"))));

        Mono<BufferedImage> source = artService.getImage(new AlbumId("Artist1", "Album1"), ArtSize.MEDIUM);
        StepVerifier.create(source)
            .expectNextCount(1)
            .verifyComplete();
    }

    @Test
    void itReturnsTrackImage() {
        when(mongoTemplate.aggregate(any(), eq(Location.class)))
            .thenReturn(Flux.just(new Location(albumArtPath("Artist1", "Album1"))));

        Mono<BufferedImage> source = artService.getImage(new TrackId("Artist1", "Album1", "Track1"), ArtSize.MEDIUM);
        StepVerifier.create(source)
            .expectNextCount(1)
            .verifyComplete();
    }

    @Test
    void itReturnsPlaylistImage() {
        when(mongoTemplate.aggregate(any(), eq(AlbumId.class)))
            .thenReturn(Flux.just(new AlbumId("Artist1", "Album1")));

        when(mongoTemplate.aggregate(any(), eq(Location.class)))
            .thenReturn(Flux.just(new Location(albumArtPath("Artist1", "Album1"))));

        Mono<BufferedImage> source = artService.getImage(new PlaylistId("Playlist1"), ArtSize.MEDIUM);
        StepVerifier.create(source)
            .expectNextCount(1)
            .verifyComplete();
    }

    private static String albumArtPath(String albumArtistName, String albumName) {
        return artRoot.resolve(Path.of("albums", albumArtistName, albumName)).toString();
    }
}
