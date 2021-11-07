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

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.transfer.DataExport;
import uk.co.caprica.choonio.service.clock.Clock;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.zip.GZIPOutputStream;

import static reactor.core.scheduler.Schedulers.boundedElastic;

@Service
@RequiredArgsConstructor
@Slf4j
public class BackupService implements Transfers.BackupService {

    private final Clock.Service clockService;
    private final Transfers.ExportService exportService;

    private final ObjectMapper objectMapper;

    @Value("#{systemProperties['user.home']}")
    private String userDirectory;

    @Value("${app.backup.directory:.choonio/backup}")
    private String backupDirectory;

    @Value("${app.backup.dateFormat:yyyy-MM-dd}")
    private String dateFormatPattern;

    @Value("${app.backup.timestampFormat:yyyyMMdd-HHmmss}")
    private String timestampFormatPattern;

    @Value("${app.backup.fileTemplate:choonio-data-%s.json.gz}")
    private String backupFileTemplate;

    private DateTimeFormatter dateFormatter;
    private DateTimeFormatter timestampFormatter;

    @PostConstruct
    private void postConstruct() {
        dateFormatter = DateTimeFormatter.ofPattern(dateFormatPattern);
        timestampFormatter = DateTimeFormatter.ofPattern(timestampFormatPattern);
    }

    @Override
    public Mono<Void> backupData() {
        log.info("backupData()");
        return exportService.exportData()
            .publishOn(boundedElastic())
            .flatMap(this::writeToFile);
    }

    private Mono<Void> writeToFile(DataExport content) {
        log.info("writeToFile()");
        return getBackupFile().flatMap(backupFile -> {
            try {
                log.info("Creating data backup in {}", backupFile);
                FileOutputStream out = new FileOutputStream(backupFile);
                GZIPOutputStream gzip = new GZIPOutputStream(out);
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(gzip, content);
                log.info("Finished writing data backup to {}", backupFile);
                return Mono.create(MonoSink::success);
            } catch (IOException e) {
                log.error("Failed to write data backup", e);
                return Mono.error(e);
            }
        });
    }

    private Mono<File> getBackupFile() {
        log.info("getBackupFile()");
        Path backupLocation = Path.of(userDirectory, backupDirectory, dateFormatter.format(clockService.localDate()));
        log.info("backupLocation={}", backupLocation);
        if (!backupLocation.toFile().exists()) {
            if (!backupLocation.toFile().mkdirs()) {
                return Mono.error(() -> new IOException("Unable to create backup directory or one of its parents: ".concat(backupLocation.toString())));
            }
        }
        Path backupFile = backupLocation.resolve(String.format(backupFileTemplate, timestampFormatter.format(clockService.localDateTime())));
        return Mono.just(backupFile.toFile());
    }
}
