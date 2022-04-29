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

package uk.co.caprica.choonio.service.transfer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShutdownBackupService implements ApplicationListener<ContextClosedEvent> {

    private final Transfers.BackupService backupService;

    @Value("${app.backup.enableOnShutdown:true}")
    private boolean enableOnShutdown;

    @Override
    public void onApplicationEvent(ContextClosedEvent contextClosedEvent) {
        log.info("onApplicationEvent(contextClosedEvent={})", contextClosedEvent);
        // A context listener is used to execute shutdown code before all the beans (such as connection pools) have been
        // shutdown themselves - one downside however is that this will be invoked immediately if the context fails to
        // startup in the first place for some reason
        try {
            if (enableOnShutdown) {
                backupService.backupData().block();
            }
        } catch (Exception e) {
            log.warn("Exception thrown while trying to write data backup during shutdown", e);
        }
    }
}
