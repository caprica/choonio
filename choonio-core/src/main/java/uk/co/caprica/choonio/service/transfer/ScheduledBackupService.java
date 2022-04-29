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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledBackupService {

    private final Transfers.BackupService backupService;

    @Value("${app.backup.enableOnSchedule:true}")
    private boolean enableOnSchedule;

    @Scheduled(
        initialDelayString = "#{${app.backup.initialDelaySeconds:10} * 1000}",
        fixedDelayString = "#{${app.backup.fixedDelaySeconds:1800000} * 1000}"
    )
    public void backupData() {
        log.info("backupData()");
        if (enableOnSchedule) {
            backupService.backupData().block();
        }
    }
}
