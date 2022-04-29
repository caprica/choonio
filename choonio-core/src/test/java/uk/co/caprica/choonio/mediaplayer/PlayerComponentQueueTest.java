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

package uk.co.caprica.choonio.mediaplayer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.queue.QueueMode;
import uk.co.caprica.choonio.domain.RepeatMode;
import uk.co.caprica.choonio.service.clock.ClockService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PlayerComponentQueueTest {

    private static final AlbumTrack TRACK_1 = track(3, "Fury Weekend", "Escape from Neon City", "Sleepless Nights");
    private static final AlbumTrack TRACK_2 = track(6, "NINA", "Synthian", "Unnoticed");
    private static final AlbumTrack TRACK_3 = track(2, "Cassetter", "Entropy", "The Haunted Train");
    private static final AlbumTrack TRACK_4 = track(1, "Neon Nox", "Last Stand", "Recon");
    private static final AlbumTrack TRACK_5 = track(7, "New Arcades", "In The Deepest Of Dreams", "Don't Stop Dreaming");

    private PlayerComponentQueue playerComponentQueue;

    @BeforeEach
    void beforeEach() {
        playerComponentQueue = new PlayerComponentQueue(new ClockService());
        playerComponentQueue.add(tracks(), QueueMode.PLAY);
    }

    @Test
    void itSetsInitialState() {
        assertEquals(RepeatMode.NO_REPEAT, playerComponentQueue.getRepeatMode());
        assertNull(playerComponentQueue.current());
    }

    @Test
    void itSetsRepeatMode() {
        playerComponentQueue.setRepeatMode(RepeatMode.NO_REPEAT);
        assertEquals(RepeatMode.NO_REPEAT, playerComponentQueue.getRepeatMode());
        playerComponentQueue.setRepeatMode(RepeatMode.REPEAT_ONE);
        assertEquals(RepeatMode.REPEAT_ONE, playerComponentQueue.getRepeatMode());
        playerComponentQueue.setRepeatMode(RepeatMode.REPEAT_ALL);
        assertEquals(RepeatMode.REPEAT_ALL, playerComponentQueue.getRepeatMode());
    }

    @Test
    void itAddsItemsToQueue() {
        List<AlbumTrack> result = playerComponentQueue.getBaseTracks();
        assertNotNull(result);

        assertEquals(TRACK_1, result.get(0));
        assertEquals(TRACK_2, result.get(1));
        assertEquals(TRACK_3, result.get(2));
        assertEquals(TRACK_4, result.get(3));
        assertEquals(TRACK_5, result.get(4));
        assertEquals(5, result.size());
    }

    @Test
    void itClearsQueue() {
        playerComponentQueue.clear();
        assertNotNull(playerComponentQueue.getBaseTracks());
        assertNotNull(playerComponentQueue.getPlayQueue());
        assertTrue(playerComponentQueue.getBaseTracks().isEmpty());
        assertTrue(playerComponentQueue.getPlayQueue().isEmpty());
    }

    @Test
    void itSetsCurrentTrackOnFirstNext() {
        assertEquals(0, playerComponentQueue.next().getIndex());
    }

    @Test
    void itSetslastTrackOnFirstPrevious() {
        assertEquals(4, playerComponentQueue.previous().getIndex());
    }

    @Test
    void itGoesToNextTrackOnNext() {
        assertEquals(0, playerComponentQueue.next().getIndex());
        assertEquals(1, playerComponentQueue.next().getIndex());
        assertEquals(2, playerComponentQueue.next().getIndex());
        assertEquals(3, playerComponentQueue.next().getIndex());
        assertEquals(4, playerComponentQueue.next().getIndex());
    }

    @Test
    void itGoesToPreviousTrackOnPrevious() {
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(4, playerComponentQueue.current().getIndex());
        assertEquals(3, playerComponentQueue.previous().getIndex());
        assertEquals(2, playerComponentQueue.previous().getIndex());
        assertEquals(1, playerComponentQueue.previous().getIndex());
        assertEquals(0, playerComponentQueue.previous().getIndex());
    }

    @Test
    void itStopsAtFirstTrackOnPrevious() {
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(1, playerComponentQueue.current().getIndex());
        assertEquals(0, playerComponentQueue.previous().getIndex());
        assertNull(playerComponentQueue.previous());
    }

    @Test
    void itStopsAtLastTrackOnNextWhenModeIsNoRepeat() {
        playerComponentQueue.setRepeatMode(RepeatMode.NO_REPEAT);
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(4, playerComponentQueue.current().getIndex());
        assertNull(playerComponentQueue.next());
    }

    @Test
    void itKeepsCurrentTrackOnNextWhenModeIsRepeatOne() {
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(1, playerComponentQueue.current().getIndex());
        playerComponentQueue.setRepeatMode(RepeatMode.REPEAT_ONE);
        assertEquals(1, playerComponentQueue.next().getIndex());
        assertEquals(1, playerComponentQueue.next().getIndex());
    }

    @Test
    void itWrapsToFirstTrackOnNextWhenModeIsRepeatAll() {
        playerComponentQueue.setRepeatMode(RepeatMode.REPEAT_ALL);
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(4, playerComponentQueue.current().getIndex());
        assertEquals(0, playerComponentQueue.next().getIndex());
    }

    @Test
    void itKeepsCurrentTrackOnPreviousWhenModeIsRepeatOne() {
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(2, playerComponentQueue.current().getIndex());
        playerComponentQueue.setRepeatMode(RepeatMode.REPEAT_ONE);
        assertEquals(2, playerComponentQueue.previous().getIndex());
        assertEquals(2, playerComponentQueue.current().getIndex());
    }

    @Test
    void itGoesToFirstTrackOnFirst() {
        assertEquals(0, playerComponentQueue.first().getIndex());
        playerComponentQueue.next();
        playerComponentQueue.previous();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(0, playerComponentQueue.first().getIndex());
    }

    @Test
    void itReturnsImmutableLists() {
        assertThrows(UnsupportedOperationException.class, () -> playerComponentQueue.getBaseTracks().add(TRACK_1));
        assertThrows(UnsupportedOperationException.class, () -> playerComponentQueue.getPlayQueue().add(TRACK_1));
        assertThrows(UnsupportedOperationException.class, () -> playerComponentQueue.getRemainingPlayQueue().add(TRACK_1));
    }

    @Test
    void itSetsCurrentTrack() {
        playerComponentQueue.next();
        assertEquals(0, playerComponentQueue.current().getIndex());
        playerComponentQueue.next();
        assertEquals(1, playerComponentQueue.current().getIndex());
        playerComponentQueue.previous();
        assertEquals(0, playerComponentQueue.current().getIndex());
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        playerComponentQueue.next();
        assertEquals(4, playerComponentQueue.current().getIndex());
        playerComponentQueue.next();
        assertNull(playerComponentQueue.current());
    }

    @Test
    void itReturnsRemainingPlayQueue() {
        assertEquals(5, playerComponentQueue.getRemainingPlayQueue().size());
        playerComponentQueue.next();
        assertEquals(4, playerComponentQueue.getRemainingPlayQueue().size());
        playerComponentQueue.next();
        assertEquals(3, playerComponentQueue.getRemainingPlayQueue().size());
        playerComponentQueue.next();
        assertEquals(2, playerComponentQueue.getRemainingPlayQueue().size());
        playerComponentQueue.next();
        assertEquals(1, playerComponentQueue.getRemainingPlayQueue().size());
        playerComponentQueue.next();
        assertEquals(0, playerComponentQueue.getRemainingPlayQueue().size());
    }

    @Test
    void itReturnsPlaylist() {
        Playlist playlist = playerComponentQueue.playlist();
        assertNotNull(playlist);
        assertEquals(new PlaylistId("Queue"), playlist.getMediaId());
        assertNotNull(playlist.getItems());
        // FIXME
        assertEquals(5, playlist.getItems().size());
    }

    private static AlbumTrack track(int number, String albumArtistName, String albumName, String trackName) {
        return new AlbumTrack(
            new TrackId(albumArtistName, albumName, trackName),
            number,
            albumArtistName,
            0,
            "filename.mp3",
            null
        );
    }

    private static List<AlbumTrack> tracks() {
        return List.of(
            TRACK_1,
            TRACK_2,
            TRACK_3,
            TRACK_4,
            TRACK_5
        );
    }
}
