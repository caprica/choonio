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

import lombok.SneakyThrows;

import java.util.concurrent.Callable;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

abstract class BaseReadWriteLock {

    private final ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    @SneakyThrows
    protected final <T> T withReadLock(Callable<T> callable) {
        readWriteLock.writeLock().lock();
        try {
            return callable.call();
        } finally {
            readWriteLock.writeLock().unlock();
        }
    }

    @SneakyThrows
    protected final <T> T withWriteLock(Callable<T> callable) {
        readWriteLock.writeLock().lock();
        try {
            return callable.call();
        } finally {
            readWriteLock.writeLock().unlock();
        }
    }

    protected final void withWriteLock(Runnable runnable) {
        readWriteLock.writeLock().lock();
        try {
            runnable.run();
        } finally {
            readWriteLock.writeLock().unlock();
        }
    }
}
