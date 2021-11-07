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

package uk.co.caprica.choonio.service.transfer;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.support.GenericApplicationContext;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShutdownBackupServiceTest {

    @Mock
    private Transfers.BackupService backupService;

    @InjectMocks
    private ShutdownBackupService shutdownBackupService;

    @Test
    void itExecutesBackupWhenBackupOnShutdownEnabled() {
        ReflectionTestUtils.setField(shutdownBackupService, "enableOnShutdown", true);
        when(backupService.backupData()).thenReturn(Mono.create(MonoSink::success));
        shutdownBackupService.onApplicationEvent(new ContextClosedEvent(new GenericApplicationContext()));
        verify(backupService).backupData();
    }

    @Test
    void itSkipsBackupWhenBackUpOnShutdownDisabled() {
        ReflectionTestUtils.setField(shutdownBackupService, "enableOnShutdown", false);
        shutdownBackupService.onApplicationEvent(new ContextClosedEvent(new GenericApplicationContext()));
        verify(backupService, never()).backupData();
    }
}