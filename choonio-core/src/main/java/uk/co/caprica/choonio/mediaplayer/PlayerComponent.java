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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.Disposable;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.equalizer.EqualizerPreset;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.queue.QueueMode;
import uk.co.caprica.choonio.domain.RepeatMode;
import uk.co.caprica.choonio.domain.ShuffleMode;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.NowPlaying;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.choonio.service.plays.Plays;
import uk.co.caprica.vlcj.player.base.Equalizer;
import uk.co.caprica.vlcj.player.component.AudioPlayerComponent;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;

/**
 * Encapsulation of a single media player and a playlist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PlayerComponent extends BaseReadWriteLock {

    private final Clock.Service clockService;
    private final Plays.Service playsService;
    private final AudioPlayerComponent playerComponent;
    private final ServerSentEventManager serverSentEventManager;

    @Value("${app.player.skipBackThreshold}")
    private int skipBackThreshold;

    @Value("${app.player.recordPlayThreshold}")
    private int recordPlayThreshold;

    private PlayerComponentState playerComponentState;
    private PlayerComponentQueue playerComponentQueue;

    private QueueItem current;

    private Disposable recordPlayDisposable;

    private Equalizer equalizer;

    @PostConstruct
    private void postConstruct() {
        playerComponentState = new PlayerComponentState(
            playerComponent.mediaPlayer(),
            clockService,
            serverSentEventManager,
            () -> {
                log.info("mediaFinished()");
                mediaFinished();
            }
        );
        playerComponentQueue = new PlayerComponentQueue(clockService);
        equalizer = playerComponent.mediaPlayerFactory().equalizer().newEqualizer();
    }

    public void repeat(RepeatMode repeatMode) {
        log.info("repeat(repeatMode={})", repeatMode);
        playerComponentQueue.setRepeatMode(repeatMode);
        playerComponentState.setRepeatMode(repeatMode);
    }

    public void shuffle(ShuffleMode shuffleMode) {
        log.info("shuffle(shuffleMode={})", shuffleMode);
        playerComponentState.setShuffleMode(shuffleMode);
    }

    public Playlist getPlaylist() {
        log.info("getPlaylist()");
        return playerComponentQueue.playlist();
    }

    public void addToQueue(List<AlbumTrack> tracks, QueueMode queueMode, boolean shuffle) {
        log.info("addToQueue(tracks={}, queueMode={}, shuffle={})", tracks, queueMode, shuffle);
        if (shuffle) {
            Collections.shuffle(tracks);
        }
        playerComponentQueue.add(tracks, queueMode);
        if (queueMode == QueueMode.PLAY) {
            log.info("Queue mode is PLAY, so starting playback");
            playNext();
        }
    }

    public void clearQueue() {
        log.info("clearQueue()");
        playerComponentQueue.clear();
    }

    public void skipNext() {
        log.info("skipNext()");
        playNext();
    }

    public void skipPrevious() {
        log.info("skipPrevious()");
        long time = playerComponentState.getTime();
        log.info("time={}, skipBackThreshold={}", time, skipBackThreshold);
        if (time < skipBackThreshold) {
            log.info("play previous");
            playPrevious();
        } else {
            log.info("replay current");
            playItem(current);
        }
    }

    /**
     * Start media playback.
     * <p>
     * This should, where possible, always play something, whether it is resuming from a pause, or restarting from the
     * beginning of the play queue.
     */
    public void play() {
        log.info("play()");
        if (current == null) {
            playFirst();
        } else {
            withWriteLock(() -> playerComponent.mediaPlayer().controls().play());
        }
    }

    public void pause() {
        log.info("pause()");
        withWriteLock(() -> playerComponent.mediaPlayer().controls().setPause(true));
    }

    public void mute() {
        log.info("mute()");
        withWriteLock(() -> playerComponent.mediaPlayer().audio().setMute(true));
    }

    public void unmute() {
        log.info("unmute()");
        withWriteLock(() -> playerComponent.mediaPlayer().audio().setMute(false));
    }

    public void setVolume(int volume) {
        log.info("setVolume(volume={})", volume);
        withWriteLock(() -> {
            playerComponent.mediaPlayer().audio().setVolume(volume);
            playerComponent.mediaPlayer().audio().setMute(false);
        });
    }

    public void setPosition(float position) {
        log.info("setPosition(position={})", position);
        withWriteLock(() -> playerComponent.mediaPlayer().controls().setPosition(position));
    }

    public Equalizer getEqualizer() {
        log.info("getEqualizer()");
        return playerComponent.mediaPlayer().audio().equalizer();
    }

    public void enableEqualizer(boolean enable) {
        log.info("enableEqualizer(enable={})", enable);
        playerComponent.mediaPlayer().audio().setEqualizer(enable ? equalizer : null);
    }

    public void setEqualizer(float preamp, float[] bands) {
        log.info("setEqualizer(preamp={}, bands={})", preamp, Arrays.toString(bands));
        equalizer.setAmps(preamp, bands);
    }

    public List<EqualizerPreset> getEqualizerPresets() {
        log.info("getEqualizerPresets()");
        Map<String, Equalizer> equalizers = playerComponent.mediaPlayerFactory().equalizer().allPresetEqualizers();
        return equalizers.entrySet()
            .stream()
            .map(entry -> new EqualizerPreset(
                entry.getKey(),
                entry.getValue().preamp(),
                entry.getValue().amps()
            ))
            .sorted(comparing(EqualizerPreset::getName))
            .collect(toList());
    }

    private void playFirst() {
        log.info("playFirst()");
        QueueItem first = playerComponentQueue.first();
        log.info("first={}", first);
        playItem(first);
    }

    private void playNext() {
        log.info("playNext()");
        QueueItem next = playerComponentQueue.next();
        log.info("next={}", next);
        playItem(next);
    }

    private void playPrevious() {
        log.info("playPrevious()");
        QueueItem previous = playerComponentQueue.previous();
        log.info("previous={}", previous);
        playItem(previous);
    }

    private void mediaFinished() {
        log.info("mediaFinished()");
        playNext();
    }

    /**
     * Playback rules when changing items.
     * <p>
     * General rules that apply in all circumstances:
     * <ul>
     *     <li>
     *         Whether the action is "next" or "previous", if the item to play is <code>null</code> then ensure playback
     *         is stopped and there is no new current item.
     *     </li>
     * </ul>
     * Rules that depend on the current {@link RepeatMode}:
     * <ul>
     *     <li>
     *         For {@link RepeatMode#NO_REPEAT}, if the item to play is <code>null</code> then ensure playback is
     *         stopped and there is no new current item.
     *     </li>
     *     <li>
     *         For {@link RepeatMode#REPEAT_ONE}, replay the current item from the beginning.
     *     </li>
     *     <li>
     *         For {@link RepeatMode#REPEAT_ALL}, play the new item from the beginning.
     *     </li>
     * </ul>
     *
     * @param item item to play; may be <code>null</code>
     */
    private void playItem(QueueItem item) {
        log.info("playItem(item={})", item);
        current = item;
        if (item != null) {
            log.info("playing new item");
            current = item;
            AlbumTrack albumTrack = item.getAlbumTrack();
            log.info("albumTrack={}", albumTrack);
            String mrl = albumTrack.getFilename();
            log.info("mrl={}", mrl);
            recordPlay(albumTrack.getMediaId());
            serverSentEventManager.emit(new NowPlaying(albumTrack.getMediaId(), item.getIndex()));
            withWriteLock(() -> playerComponent.mediaPlayer().media().play(albumTrack.getFilename()));
        } else {
            log.info("no new item");
            withWriteLock(() -> playerComponent.mediaPlayer().controls().stop());
        }
    }

    private void recordPlay(TrackId trackId) {
        log.info("recordPlay(trackId={})", trackId);
        withWriteLock(() -> {
            log.info("recordPlayDisposable={}", recordPlayDisposable);
            if (recordPlayDisposable != null && !recordPlayDisposable.isDisposed()) {
                log.info("Cancelling previous record play");
                recordPlayDisposable.dispose();
            }
            // Delay the recording of the newly played item in case it is rapidly skipped, such transient plays are not
            // meaningful, and it is not desirable to have them in the history
            recordPlayDisposable = playsService.create(trackId.getAlbumArtistName(), trackId.getAlbumName(), trackId.getTrackName())
                .delaySubscription(Duration.ofSeconds(recordPlayThreshold))
                .subscribe();
        });
    }
}
