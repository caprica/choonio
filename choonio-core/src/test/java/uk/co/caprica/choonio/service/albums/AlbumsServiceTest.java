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

package uk.co.caprica.choonio.service.albums;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;
import reactor.test.publisher.TestPublisher;
import uk.co.caprica.choonio.api.model.albums.Album;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.database.repositories.AlbumsRepository;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import static java.util.Collections.emptyList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlbumsServiceTest {

    @Mock
    private AlbumsRepository albumsRepository;

    @Mock
    private AlbumEnrichment albumEnrichment;

    @Mock
    private ReactiveMongoTemplate mongoTemplate;

    @InjectMocks
    private AlbumsService albumsService;

    @Test
    void itReturnsAlbums() {
        Album album1 = new Album(
            "1",
            new AlbumId("Street Cleaner", "Edge"),
            2021,
            "Darksynth",
            emptyList(),
            2835,
            new int[] { 10, 20, 30 },
            Instant.parse("2021-10-14T12:34:56.789Z"),
            "/home/music/Edge/Street Cleaner"
        );

        Album album2 = new Album(
            "2",
            new AlbumId("Dana Jean Phoenix", "PixelDust"),
            2018,
            "Dance/Electronic",
            emptyList(),
            2514,
            new int[] { 30, 20, 10 },
            Instant.parse("2021-08-25T22:33:44.555Z"),
            "/home/music/Dana Jean Phoenix/PixelDust"
        );

        TestPublisher<Album> publisher = TestPublisher.create();
        when(albumsRepository.findAll())
            .thenReturn(publisher.flux());

        Flux<Album> source = albumsService.getAlbums();
        StepVerifier.create(source)
            .then(() -> publisher.emit(album1, album2))
            .expectNext(album1, album2)
            .verifyComplete();
    }

    @Test
    void itReturnsAlbum() {
        Album album = new Album(
            "1",
            new AlbumId("Street Cleaner", "Edge"),
            2021,
            "Darksynth",
            emptyList(),
            2835,
            new int[] { 10, 20, 30 },
            Instant.parse("2021-10-14T12:34:56.789Z"),
            "/home/music/Edge/Street Cleaner"
        );

        TestPublisher<Album> publisher = TestPublisher.create();
        when(albumsRepository.findByMediaId(eq(new AlbumId("Street Cleaner", "Edge"))))
            .thenReturn(publisher.mono());

        when(albumEnrichment.enrichAlbum(eq(album)))
            .thenReturn(Mono.just(album));

        Mono<Album> source = albumsService.getAlbum("Street Cleaner", "Edge");
        StepVerifier.create(source)
            .then(() -> publisher.emit(album))
            .expectNext(album)
            .verifyComplete();
    }

    @Test
    void itReturnsTracksForArtist() {
        AlbumTrack albumTrack = new AlbumTrack(
            new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
            6,
            "Absolute Valentine",
            140,
            null,
            null
        );

        when(mongoTemplate.aggregate(any(), eq(AlbumTrack.class)))
            .thenReturn(Flux.just(albumTrack));

        Flux<AlbumTrack> source = albumsService.getArtistTracks("Absolute Valentine");
        StepVerifier.create(source)
            .expectNext(albumTrack)
            .verifyComplete();
    }

    @Test
    void itReturnsTracksForAlbum() {
        AlbumTrack albumTrack = new AlbumTrack(
            new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
            6,
            "Absolute Valentine",
            140,
            null,
            null
        );

        when(mongoTemplate.aggregate(any(), eq(AlbumTrack.class)))
            .thenReturn(Flux.just(albumTrack));

        Flux<AlbumTrack> source = albumsService.getAlbumTracks("Absolute Valentine", "Police Heartbreaker");
        StepVerifier.create(source)
            .expectNext(albumTrack)
            .verifyComplete();
    }

    @Test
    void itReturnsTrack() {
        AlbumTrack albumTrack = new AlbumTrack(
            new TrackId("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street"),
            6,
            "Absolute Valentine",
            140,
            null,
            null
        );

        when(mongoTemplate.aggregate(any(), eq(AlbumTrack.class)))
            .thenReturn(Flux.just(albumTrack));

        Flux<AlbumTrack> source = albumsService.getAlbumTrack("Absolute Valentine", "Police Heartbreaker", "In the 42nd Street");
        StepVerifier.create(source)
            .expectNext(albumTrack)
            .verifyComplete();
    }

    @Test
    void itDeletesAlbums() {
        albumsService.deleteAlbums();
        verify(albumsRepository).deleteAll();
    }

    @Test
    void itReturnsTracks() {
        Set<TrackId> trackIds = Set.of(
            new TrackId("Neon Nox", "Last Stand", "Recon"),
            new TrackId("Neon Nox", "Last Stand", "Rogue"),
            new TrackId("Signal Void", "This Liminal Reality", "Gaia")
        );

        Set<AlbumId> albumIds = Set.of(
            new AlbumId("Neon Nox", "Last Stand"),
            new AlbumId("Signal Void", "This Liminal Reality")
        );

        AlbumTrack albumTrack1 = new AlbumTrack(
            new TrackId("Neon Nox", "Last Stand", "Recon"),
            5,
            "Neon Nox",
            235,
            null,
            null
        );

        AlbumTrack albumTrack2 = new AlbumTrack(
            new TrackId("Neon Nox", "Last Stand", "Rogue"),
            1,
            "Neon Nox",
            247,
            null,
            null
        );

        AlbumTrack albumTrack3 = new AlbumTrack(
            new TrackId("Signal Void", "This Liminal Reality", "Gaia"),
            3,
            "Signal Void",
            250,
            null,
            null
        );

        when(albumsRepository.findAllByMediaIdIn(eq(albumIds)))
            .thenReturn(Flux.fromIterable(List.of(
                new Album(
                    "1",
                    new AlbumId("Neon Nox", "Last Stand"),
                    2020,
                    "Dance/Electronic",
                    List.of(
                        albumTrack1,
                        albumTrack2
                    ),
                    2354,
                    null,
                    null,
                    null
                ),
                new Album(
                    "2",
                    new AlbumId("Signal Void", "This Liminal Reality"),
                    2019,
                    "Dance/Electronic",
                    List.of(
                        albumTrack3
                    ),
                    2737,
                    null,
                    null,
                    null
                )
            )));

        Flux<AlbumTrack> source = albumsService.getTracks(trackIds);
        StepVerifier.create(source)
            .expectNext(albumTrack1)
            .expectNext(albumTrack2)
            .expectNext(albumTrack3)
            .verifyComplete();
    }
}
