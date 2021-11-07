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

package uk.co.caprica.choonio.service.highlights;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.concurrent.Semaphore;

/**
 * Scheduled service for automatically refreshing highlights.
 * <p>
 * The idea is that the highlights are refreshed regularly (e.g. every 5th minute of the hour), but if the user requests
 * a manual refresh of the highlights then those results are guaranteed to remain for a minimum threshold time (e.g. two
 * minutes) regardless of the regular schedule.
 * <p>
 * In practice this means that the regular update may be delayed until the next period.
 * <p>
 * This gives a reasonable balance between automatic and manual updates - without this if a manual update was forced
 * shortly before the next regular update was due, then two updates in quick succession would occur.
 * <p>
 * At the same time, it allows us to keep the scheduling mechanism extremely simple without worrying about having to
 * cancel a timer task and schedule a new one if a manual refresh is forced.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HighlightsScheduledService {

    private final Semaphore semaphore = new Semaphore(1);

    private final Highlights.Service highlightsService;

    /**
     * Refresh the highlights at the scheduled time.
     * <p>
     * This is called by the scheduler, but also by {@link #contextStarted(ContextRefreshedEvent)}, and if there is a
     * window where both invocations may be executing on different threads at the same time. This ultimately leads to
     * both threads generating new highlights and attempting to update the database at the same time.
     * <p>
     * To prevent this occurring, a simple {@link Semaphore} is used.
     * <p>
     * This works because the server is single-instance of course, which is the case for this project.
     */
    @Scheduled(cron="${app.highlights.refresh.autoRefreshCron:0 */5 * * * *}")
    public void autoRefreshHighlights() {
        log.info("autoRefreshHighlights()");
        if (!semaphore.tryAcquire()) {
            log.info("did not acquire semaphore");
            return;
        }
        log.info("acquired semaphore");
        highlightsService.autoRefreshDue()
            .flatMap(refreshDue -> {
                log.info("refreshDue={}", refreshDue);
                if (refreshDue) {
                    return highlightsService.refreshHighlights();
                } else {
                    return Mono.empty();
                }
            })
            .doFinally(signalType -> {
                semaphore.release();
                log.info("released semaphore");
            })
            .subscribe();
    }

    @EventListener
    public void contextStarted(ContextRefreshedEvent evt) {
        log.info("contextStarted()");
        autoRefreshHighlights();
    }
}
