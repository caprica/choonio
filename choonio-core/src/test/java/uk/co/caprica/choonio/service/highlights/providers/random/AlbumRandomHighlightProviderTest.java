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

package uk.co.caprica.choonio.service.highlights.providers.random;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.api.model.identity.AlbumId;

import java.time.Instant;
import java.util.List;

import static java.util.Collections.emptyList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlbumRandomHighlightProviderTest {

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private AlbumRandomHighlightProvider highlightProvider;

    @BeforeEach
    void beforeEach() {
        ReflectionTestUtils.setField(highlightProvider, "sampleSize", 2);
    }

    @Test
    void itReturnsHighlights() {
        Album album1 = new Album(
            "1",
            new AlbumId("Cassetter", "Robot Era"),
            2021,
            "Synthwave",
            emptyList(),
            4399,
            null,
            Instant.parse("2021-09-07T05:05:05.555Z"),
            null
        );
        Album album2 = new Album(
            "2",
            new AlbumId("3FORCE", "Intergalactic"),
            2015,
            "Synthwave",
            emptyList(),
            2552,
            null,
            Instant.parse("2021-09-14T06:06:06.666Z"),
            null
        );

        when(mongoTemplate.aggregate(any(), eq(Album.class)))
            .thenReturn(Flux.fromIterable(List.of(
                album1,
                album2
            )));

        Flux<Highlight> source = highlightProvider.getHighlights();
        StepVerifier.create(source)
            .expectNext(new Highlight(null, "Random", "Feeling lucky album selection", new AlbumId("Cassetter", "Robot Era"), null, null))
            .expectNext(new Highlight(null, "Random", "Feeling lucky album selection", new AlbumId("3FORCE", "Intergalactic"), null, null))
            .verifyComplete();
    }

    @Test
    void itReturnsType() {
        assertEquals("Random", highlightProvider.getType());
    }
}