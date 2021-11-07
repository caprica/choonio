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

package uk.co.caprica.choonio.service.artists;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.artists.Artist;
import uk.co.caprica.choonio.api.model.identity.ArtistId;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArtistsServiceTest {

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private ArtistsService artistsService;

    @Test
    void itReturnsArtists() {
        Artist artist1 = new Artist(
            new ArtistId("Neon Nox"),
            2,
            21,
            5197
        );
        Artist artist2 = new Artist(
            new ArtistId("Tonebox"),
            3,
            30,
            8173
        );

        TestPublisher<Artist> publisher = TestPublisher.create();
        when(mongoTemplate.aggregate(any(), eq(Artist.class)))
            .thenReturn(publisher.flux());

        Flux<Artist> source = artistsService.getArtists();
        StepVerifier.create(source)
            .then(() -> publisher.emit(artist1, artist2))
            .expectNext(artist1, artist2)
            .verifyComplete();
    }

    @Test
    void itReturnsArtistsForGenre() {
        Artist artist1 = new Artist(
            new ArtistId("Neon Nox"),
            2,
            21,
            5197
        );
        Artist artist2 = new Artist(
            new ArtistId("Tonebox"),
            3,
            30,
            8173
        );

        TestPublisher<Artist> publisher = TestPublisher.create();
        when(mongoTemplate.aggregate(any(), eq(Artist.class)))
            .thenReturn(publisher.flux());

        Flux<Artist> source = artistsService.getArtistsForGenre("Synthwave");
        StepVerifier.create(source)
            .then(() -> publisher.emit(artist1, artist2))
            .expectNext(artist1, artist2)
            .verifyComplete();
    }
}
