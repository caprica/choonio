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

package uk.co.caprica.choonio.events;

import lombok.extern.slf4j.Slf4j;
import org.hashids.Hashids;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import uk.co.caprica.choonio.domain.ApplicationStatus;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.NowPlaying;
import uk.co.caprica.choonio.events.model.ServerSentEventType;
import uk.co.caprica.choonio.events.model.StatusChanged;
import uk.co.caprica.choonio.mediaplayer.PlayerState;

import javax.annotation.PostConstruct;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Component responsible for managing the stream of server-sent-events for subsequent delivery to interested clients.
 */
@Component
@Slf4j
public class ServerSentEventManager {

    private static final Hashids hashids = new Hashids(UUID.randomUUID().toString(), 6);

    /**
     * Simple incrementing counter, used to generate unique message identifiers.
     */
    private static final AtomicLong messageCounter = new AtomicLong(0);

    private final Sinks.Many<ServerSentEvent<StatusChanged>> statusChangedSink = Sinks.many()
        .replay()
        .latest();

    /**
     * Sink for "now playing" events.
     * <p>
     * The latest value is remembered so new subscribers immediately get the latest state.
     */
    private final Sinks.Many<ServerSentEvent<NowPlaying>> nowPlayingSink = Sinks.many()
        .replay()
        .latest();

    /**
     * Sink for "player state" events.
     * <p>
     * The latest value is remembered so new subscribers immediately get the latest state.
     */
    private final Sinks.Many<ServerSentEvent<PlayerState>> playerStateSink = Sinks.many()
        .replay()
        .latest();

    /**
     * Sink for "collection changed" events.
     */
    private final Sinks.Many<ServerSentEvent<CollectionChanged>> collectionChangedSink = Sinks.many()
        .multicast()
        .directBestEffort();

    /**
     * Merge the individual event streams into a single combined stream.
     * <p>
     * Events will be emitted from either stream as they occur, without waiting for an event from the other stream.
     * <p>
     * The sink implementations chosen allow multiple concurrent subscribers.
     */
    private final Flux<ServerSentEvent<?>> merged = Flux.merge(
        statusChangedSink.asFlux(),
        nowPlayingSink.asFlux(),
        playerStateSink.asFlux(),
        collectionChangedSink.asFlux()
    );

    @PostConstruct
    private void applicationReady() {
        emit(new StatusChanged(ApplicationStatus.READY));
    }

    /**
     * Get the combined event stream.
     * <p>
     * The returned stream supports multiple concurrent subscribers as they come and go.
     *
     * @return event stream
     */
    public Flux<ServerSentEvent<?>> getEventStream() {
        log.info("getEventStream()");
        return merged;
    }

    public boolean emit(StatusChanged statusChanged) {
        log.debug("emit(statusChanged={})", statusChanged);
        return statusChangedSink.tryEmitNext(
            ServerSentEvent.<StatusChanged>builder()
                .id(hashids.encode(messageCounter.getAndIncrement()))
                .event(ServerSentEventType.STATUS_CHANGED.toString())
                .data(statusChanged)
                .build()
            )
            .isSuccess();
    }

    /**
     * Emit a "now playing" event.
     *
     * @param nowPlaying event payload data
     * @return <code>true</code> if the event was accepted into the event stream; <code>false</code> otherwise
     */
    public boolean emit(NowPlaying nowPlaying) {
        log.info("emit(nowPlaying={})", nowPlaying);
        return nowPlayingSink.tryEmitNext(
            ServerSentEvent.<NowPlaying>builder()
                .id(hashids.encode(messageCounter.getAndIncrement()))
                .event(ServerSentEventType.NOW_PLAYING.toString())
                .data(nowPlaying)
                .build()
            )
            .isSuccess();
    }

    /**
     * Emit a "player state" event.
     *
     * @param playerState event payload data
     * @return <code>true</code> if the event was accepted into the event stream; <code>false</code> otherwise
     */
    public boolean emit(PlayerState playerState) {
        log.trace("emit(playerState={})", playerState);
        return playerStateSink.tryEmitNext(
            ServerSentEvent.<PlayerState>builder()
                .id(hashids.encode(messageCounter.getAndIncrement()))
                .event(ServerSentEventType.PLAYER_STATE.toString())
                .data(playerState)
                .build()
            )
            .isSuccess();
    }

    /**
     * Emit a "collection changed" event.
     *
     * @param collectionChanged event payload data
     * @return <code>true</code> if the event was accepted into the event stream; <code>false</code> otherwise
     */
    public boolean emit(CollectionChanged collectionChanged) {
        log.info("emit(collectionChanged={})", collectionChanged);
        return collectionChangedSink.tryEmitNext(
            ServerSentEvent.<CollectionChanged>builder()
                .id(hashids.encode(messageCounter.getAndIncrement()))
                .event(ServerSentEventType.COLLECTION_CHANGED.toString())
                .data(collectionChanged)
                .build()
            )
            .isSuccess();
    }
}
