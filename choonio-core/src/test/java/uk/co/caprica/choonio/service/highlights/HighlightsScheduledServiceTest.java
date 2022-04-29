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

package uk.co.caprica.choonio.service.highlights;

import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Timeout;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;

import java.util.concurrent.Semaphore;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

// Is this test OK, because it does an internal subscribe, is it racy? the scheduled service should probably return something even though it's not used by Spring?

@ExtendWith(MockitoExtension.class)
class HighlightsScheduledServiceTest {

    @Mock
    private Highlights.Service highlightsService;

    @InjectMocks
    private HighlightsScheduledService highlightsScheduledService;

    @Test
    void itRefreshesHighlightsIfAutoRefreshDue() {
        when(highlightsService.autoRefreshDue()).thenReturn(Mono.just(Boolean.TRUE));
        when(highlightsService.refreshHighlights()).thenReturn(Mono.create(MonoSink::success));

        highlightsScheduledService.autoRefreshHighlights();

        verify(highlightsService).refreshHighlights();
    }

    @Test
    void itDoesNotRefreshHighlightsIfAutoRefreshNotDue() {
        when(highlightsService.autoRefreshDue()).thenReturn(Mono.just(Boolean.FALSE));

        highlightsScheduledService.autoRefreshHighlights();

        verify(highlightsService, never()).refreshHighlights();
    }

    @Test
    @Timeout(5)
    @SneakyThrows
    void itDoesNotBlockWhenSemaphoreNotAvailable() {
        Semaphore semaphore = (Semaphore) ReflectionTestUtils.getField(highlightsScheduledService, "semaphore");
        try {
            assertTrue(semaphore.tryAcquire());
            highlightsScheduledService.autoRefreshHighlights();
        } finally {
            semaphore.release();
        }

        verify(highlightsService, never()).autoRefreshDue();
        verify(highlightsService, never()).refreshHighlights();
    }
}