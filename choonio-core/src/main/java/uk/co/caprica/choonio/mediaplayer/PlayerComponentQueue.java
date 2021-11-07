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

package uk.co.caprica.choonio.mediaplayer;

import lombok.extern.slf4j.Slf4j;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.api.model.queue.QueueMode;
import uk.co.caprica.choonio.domain.RepeatMode;
import uk.co.caprica.choonio.service.clock.Clock;

import java.util.ArrayList;
import java.util.List;

import static java.util.Collections.emptyList;
import static java.util.Collections.unmodifiableList;
import static java.util.stream.Collectors.toList;
import static uk.co.caprica.choonio.api.model.playlists.Playlist.newPlaylist;
import static uk.co.caprica.choonio.api.model.queue.QueueMode.PLAY;

/**
 * Companion class for {@link PlayerComponent} that managers the play queue and provides associated operations on that
 * queue.
 * <p>
 * A queue manager is responsible for maintaining a queue of items (tracks) to play, and managing the current item.
 * <p>
 * The queue manager is itself orthogonal to the playback of those items in a media player component.
 * <p>
 * Special behaviours, e.g. having {@link #next()} NOT advance to the next item if it is already the last item, are not
 * the responsibility of this component.
 * <p>
 * This component makes use of a read-write lock when accessing the queue.
 * <p>
 * The read-lock should be taken when only reading queue state.
 * <p>
 * The write-lock should be taken when performing any mutation on queue state, the current index, the lists of
 * tracks and so on.
 */
@Slf4j
final class PlayerComponentQueue extends BaseReadWriteLock {

    private static final PlaylistId QUEUE_ID = new PlaylistId("Queue");
    private static final String QUEUE_DESCRIPTION = "Current play queue";

    private static final int EXHAUSTED = -1;

    private final Clock.Service clockService;

    /**
     * Current repeat mode behaviour.
     */
    private RepeatMode repeatMode = RepeatMode.NO_REPEAT;

    /**
     * Current queue, in original order.
     */
    private List<AlbumTrack> baseQueue;

    /**
     * Current queue, possibly in shuffled order.
     */
    private List<AlbumTrack> playQueue;

    /**
     * Index of the current item in the play queue.
     * <p>
     * When this is <code>null</code>, it means there has been no activity on the queue yet, or the queue has been
     * reset.
     * <p>
     * When this is -1, it means the queue has been exhausted (no more items).
     * <p>
     * Any other value is the index of the current item in the queue.
     */
    private Integer currentIndex = null;

    PlayerComponentQueue(Clock.Service clockService) {
        this.clockService = clockService;
        withWriteLock(this::resetQueue);
    }

    RepeatMode getRepeatMode() {
        log.info("getRepeatMode()");
        return withReadLock(() -> repeatMode);
    }

    void setRepeatMode(RepeatMode repeatMode) {
        log.info("setRepeatMode(repeatMode={})", repeatMode);
        withWriteLock(() -> this.repeatMode = repeatMode);
    }

    void add(List<AlbumTrack> trackIds, QueueMode queueMode) {
        log.info("add(trackIds={}, queueMode={})", trackIds, queueMode);
        withWriteLock(() -> {
            if (queueMode == PLAY) {
                resetQueue();
            }
            baseQueue.addAll(trackIds);
            playQueue.addAll(trackIds);
        });
    }

    void clear() {
        log.info("clear()");
        withWriteLock(this::resetQueue);
    }

    List<AlbumTrack> getBaseTracks() {
        return withReadLock(() -> unmodifiableList(baseQueue));
    }

    List<AlbumTrack> getPlayQueue() {
        return withReadLock(() -> unmodifiableList(playQueue));
    }

    List<AlbumTrack> getRemainingPlayQueue() {
        return withReadLock(() -> {
            if (isExhausted()) {
                return emptyList();
            }
            int fromIndex = currentIndex != null ? currentIndex + 1 : 0;
            if (fromIndex < playQueue.size()) {
                return unmodifiableList(playQueue.subList(fromIndex, playQueue.size()));
            } else {
                return emptyList();
            }
        });
    }

    /**
     * Get the current play queue as a playlist.
     *
     * @return playlist
     */
    Playlist playlist() {
        log.info("playlist()");
        return withReadLock(() -> {
            List<PlaylistItem> items = getPlayQueue().stream()
                .map(AlbumTrack::getMediaId)
                .map(PlaylistItem::newPlaylistItem)
                .collect(toList());
            return newPlaylist(QUEUE_ID, QUEUE_DESCRIPTION, clockService.instant())
                .withItems(items);
        });
    }

    /**
     * Get the current item in the queue.
     *
     * @return current item in the queue, or <code>null</code> if no current item
     */
    QueueItem current() {
        log.info("current()");
        return withReadLock(() -> {
            if (!isExhausted() && hasCurrent()) {
                return new QueueItem(playQueue.get(currentIndex), currentIndex);
            } else {
                return null;
            }
        });
    }

    /**
     * Go to the first item in the queue.
     * <p>
     * This will always effectively reset the playback queue even if it was previously exhausted.
     *
     * @return first item in the queue, or <code>null</code> if no first item
     */
    QueueItem first() {
        return withWriteLock(() -> {
            if (!playQueue.isEmpty()) {
                setCurrentIndex(0);
            } else {
                setCurrentIndex(null);
            }
            return current();
        });
    }
    
    /**
     * Go to the next item in the queue.
     * <p>
     * The next-item behaviour depends on the current {@link #repeatMode}.
     * <p>
     * Depending on the repeat mode this may exhaust the queue.
     *
     * @return next item in the queue, or <code>null</code> if no next item
     */
    QueueItem next() {
        log.info("next()");
        return withWriteLock(() -> {
            if (isExhausted()) {
                return null;
            } else if (hasCurrent()) {
                int newIndex = switch (repeatMode) {
                    case NO_REPEAT -> nextNoRepeat();
                    case REPEAT_ONE -> nextRepeatOne();
                    case REPEAT_ALL -> nextRepeatAll();
                };
                setCurrentIndex(newIndex);
            } else {
                setCurrentIndex(0);
            }
            return current();
        });
    }

    /**
     * Go to the previous item in the queue.
     * <p>
     * The previous-item behaviour depends on the current {@link #repeatMode}.
     * <p>
     * Depending on the repeat mode this may exhaust the queue.
     *
     * @return previous item in the queue, or <code>null</code> if no previous item
     */
    QueueItem previous() {
        log.info("previous()");
        return withWriteLock(() -> {
            if (isExhausted()) {
                return null;
            } else if (hasCurrent()) {
                int newIndex = switch (repeatMode) {
                    case NO_REPEAT -> previousNoRepeat();
                    case REPEAT_ONE -> previousRepeatOne();
                    case REPEAT_ALL -> previousRepeatAll();
                };
                setCurrentIndex(newIndex);
            } else {
                setCurrentIndex(lastIndex());
            }
            return current();
        });
    }

    private int nextNoRepeat() {
        log.info("nextNoRepeat()");
        if (notLastIndex()) {
            log.info("Next item for no-repeat");
            return currentIndex + 1;
        } else {
            log.info("Exhausted items for no-repeat");
            return EXHAUSTED;
        }
    }

    private int nextRepeatOne() {
        log.info("nextRepeatOne()");
        log.info("Same item for repeat-one");
        return currentIndex;
    }

    private int nextRepeatAll() {
        log.info("nextRepeatAll()");
        if (notLastIndex()) {
            log.info("Next item for repeat-all");
            return currentIndex + 1;
        } else {
            log.info("Wrapping to first item for repeat-all");
            return 0;
        }
    }

    private int previousNoRepeat() {
        log.info("previousNoRepeat()");
        if (notFirstIndex()) {
            log.info("Previous item for no-repeat");
            return currentIndex - 1;
        } else {
            log.info("Exhausted items for no-repeat");
            return EXHAUSTED;
        }
    }

    private int previousRepeatOne() {
        log.info("previousRepeatOne()");
        log.info("Same item for repeat-one");
        return currentIndex;
    }

    private int previousRepeatAll() {
        log.info("previousRepeatAll()");
        if (notFirstIndex()) {
            log.info("Previous item for repeat-all");
            return currentIndex - 1;
        } else {
            log.info("Wrapping to last item for repeat-all");
            return lastIndex();
        }
    }

    private boolean isExhausted() {
        return currentIndex != null && currentIndex == EXHAUSTED;
    }

    private boolean hasCurrent() {
        return currentIndex != null && currentIndex != EXHAUSTED;
    }

    private boolean notLastIndex() {
        return currentIndex != lastIndex();
    }

    private boolean notFirstIndex() {
        return currentIndex != 0;
    }

    private int lastIndex() {
        return playQueue.size() - 1;
    }

    private void resetQueue() {
        log.info("resetQueue()");
        // Reallocate rather than set size to zero to reclaim memory from previously large lists
        baseQueue = new ArrayList<>();
        playQueue = new ArrayList<>();
        currentIndex = null;
    }

    private void setCurrentIndex(Integer newIndex) {
        log.info("setCurrentIndex(newIndex={})", newIndex);
        currentIndex = newIndex;
    }
}
