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

import lombok.extern.slf4j.Slf4j;
import uk.co.caprica.choonio.domain.RepeatMode;
import uk.co.caprica.choonio.domain.ShuffleMode;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.service.clock.Clock;
import uk.co.caprica.vlcj.player.base.MediaPlayer;
import uk.co.caprica.vlcj.player.base.MediaPlayerEventAdapter;
import uk.co.caprica.vlcj.player.base.MediaPlayerTimerListener;

/**
 * Companion class for {@link PlayerComponent} that deals with the media player state.
 * <p>
 * This component is responsible for translating media player events to server-sent events used to send notifications to
 * the front-end application.
 * <p>
 * On the threading and synchronisation here...
 * <p>
 * Media player event notifications come in on a native thread via the media player event listener, or on a background
 * thread in the case of the smooth timer event. When such an event is received, state is updated in volatile fields.
 * <p>
 * When any of the state attributes change, a notification event is sent via the server-sent event component.
 * <p>
 * THis level of synchronisation is lightweight and reasonable although perhaps not perfect. There may be a circumstance
 * where for example state changes while an event is being sent, but since the state notifications are transient and
 * frequent in practice this has never seemingly exhibited any erroneous behaviour.
 */
@Slf4j
final class PlayerComponentState {

    private final Clock.Service clockService;
    private final ServerSentEventManager serverSentEventManager;
    private final Runnable onMediaFinished;

    private RepeatMode repeatMode = RepeatMode.NO_REPEAT;
    private ShuffleMode shuffleMode = ShuffleMode.NO_SHUFFLE;

    private volatile boolean playing;
    private volatile long duration;
    private volatile long time;
    private volatile float position;
    private volatile int volume;

    PlayerComponentState(MediaPlayer mediaPlayer, Clock.Service clockService, ServerSentEventManager serverSentEventManager, Runnable onMediaFinished) {
        this.clockService = clockService;
        this.serverSentEventManager = serverSentEventManager;
        this.onMediaFinished = onMediaFinished;
        init(mediaPlayer);
    }

    void setRepeatMode(RepeatMode repeatMode) {
        log.info("setRepeatMode(repeatMode={})", repeatMode);
        this.repeatMode = repeatMode;
        notifyState();
    }

    void setShuffleMode(ShuffleMode shuffleMode) {
        log.info("setShuffleMode(shuffleMode={})", shuffleMode);
        this.shuffleMode = shuffleMode;
        notifyState();
    }

    boolean playing() {
        return playing;
    }

    long getTime() {
        return time;
    }

    private void init(MediaPlayer mediaPlayer) {
        log.info("init()");
        MediaPlayerEventHandler eventHandler = new MediaPlayerEventHandler();
        mediaPlayer.events().addMediaPlayerEventListener(eventHandler);
        mediaPlayer.events().addTimerListener(eventHandler);
    }

    private class MediaPlayerEventHandler extends MediaPlayerEventAdapter implements MediaPlayerTimerListener {
        @Override
        public void playing(MediaPlayer mediaPlayer) {
            log.info("playing()");
            setPlaying(true);
        }

        @Override
        public void paused(MediaPlayer mediaPlayer) {
            log.info("paused()");
            setPlaying(false);
        }

        @Override
        public void stopped(MediaPlayer mediaPlayer) {
            log.info("stopped()");
            setStopped();
        }

        @Override
        public void stopping(MediaPlayer mediaPlayer) {
            log.info("stopping()");
            setStopped();
            // Do not do this work on the native media player thread
            mediaPlayer.submit(PlayerComponentState.this::mediaFinished);
        }

        @Override
        public void error(MediaPlayer mediaPlayer) {
            log.error("error()");
            setStopped();
        }

        @Override
        public void lengthChanged(MediaPlayer mediaPlayer, long newLength) {
            // Native media player can in fact report multiple changing lengths while playing
            log.trace("lengthChanged(newLength={})", newLength);
            setDuration(newLength / 1000);
        }

        @Override
        public void positionChanged(MediaPlayer mediaPlayer, float newPosition) {
            log.trace("positionChanged(newPosition={})", newPosition);
            setPosition(newPosition);
        }

        @Override
        public void volumeChanged(MediaPlayer mediaPlayer, float volume) {
            log.info("volumeChanged(volume={})", volume);
            currentVolume(Math.round(volume * 100.f));
        }

        @Override
        public void muted(MediaPlayer mediaPlayer, boolean muted) {
            log.info("muted(muted={})", muted);
            if (muted) {
                currentVolume(0);
            } else {
                currentVolume(mediaPlayer.audio().volume());
            }
        }

        @Override
        public void tick(MediaPlayer mediaPlayer, long time) {
            log.trace("tick(time={})", time);
            setTime(time / 1000000);
        }
    }

    private void setPlaying(boolean playing) {
        log.info("setPlaying(playing={})", playing);
        this.playing = playing;
        notifyState();
    }

    private void setStopped() {
        log.info("setStopped()");
        this.time = 0;
        this.position = 0.f;
        this.playing = false;
        notifyState();
    }

    private void setDuration(long newDuration) {
        log.trace("setDuration(newDuration={})", newDuration);
        this.duration = newDuration;
        notifyState();
    }

    private void setTime(long newTime) {
        log.trace("setTime(newTime={})", newTime);
        this.time = newTime;
        notifyState();
    }

    private void setPosition(float newPosition) {
        log.trace("setPosition(newPosition={})", newPosition);
        this.position = newPosition;
        notifyState();
    }

    private void currentVolume(int volume) {
        log.info("setVolume(volume={})", volume);
        this.volume = volume;
        notifyState();
    }

    private void mediaFinished() {
        log.info("mediaPlayed()");
        onMediaFinished.run();
    }

    private void notifyState() {
        log.trace("notifyState()");
        serverSentEventManager.emit(new PlayerState(
            playing,
            duration,
            time,
            position,
            volume,
            repeatMode,
            shuffleMode,
            clockService.millis()
        ));
    }
}
