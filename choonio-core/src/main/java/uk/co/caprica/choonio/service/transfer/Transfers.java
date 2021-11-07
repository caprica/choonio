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

import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.transfer.DataExport;
import uk.co.caprica.choonio.api.model.transfer.DataImport;
import uk.co.caprica.choonio.api.model.transfer.DataType;
import uk.co.caprica.choonio.api.model.transfer.ImportMode;

import java.util.Set;

public interface Transfers {

    interface ExportService {
        Mono<DataExport> exportData();
    }

    interface ImportService {
        Mono<DataImport> importData(Mono<DataExport> dataExportMono, Set<DataType> dataTypes, ImportMode mode);
    }

    interface BackupService {
        Mono<Void> backupData();
    }
}
