package uk.co.caprica.choonio.service.catalog;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.library.MetaValidation;
import uk.co.caprica.choonio.service.clock.Clock;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
class MetaErrors {

    private final Clock.Service clockService;

    @Value("${app.meta-errors.enable:true}")
    private boolean enable;

    @Value("#{systemProperties['user.home']}/${app.meta-errors.directory:.choonio/meta-errors}")
    private String metaErrorsDirectory;

    @Value("${app.meta-errors.dateFormat:yyyy-MM-dd}")
    private String dateFormatPattern;

    @Value("${app.meta-errors.timestampFormat:yyyyMMdd-HHmmss}")
    private String timestampFormatPattern;

    @Value("${app.meta-errors.fileTemplate:choonio-data-%s.json.gz}")
    private String metaErrorsFileTemplate;

    private DateTimeFormatter dateFormatter;
    private DateTimeFormatter timestampFormatter;

    @PostConstruct
    private void postConstruct() {
        dateFormatter = DateTimeFormatter.ofPattern(dateFormatPattern);
        timestampFormatter = DateTimeFormatter.ofPattern(timestampFormatPattern);
    }

    void saveMetaErrors(List<MetaValidation> metaErrors) {
        log.info("saveMetaErrors(metaErrors=[{}])", metaErrors.size());
        log.info("enable={}", enable);
        if (enable) {
            try {
                File metaErrorsFile = getMetaErrorsFile();
                log.info("metaErrorsFile={}", metaErrorsFile);
                try (PrintWriter writer = new PrintWriter(new FileWriter(metaErrorsFile))) {
                    for (MetaValidation metaError : metaErrors) {
                        for (String errorMessage : metaError.getErrors()) {
                            writer.printf("%s,%s%n", metaError.getMeta().getFileName(), errorMessage);
                        }
                    }
                }
                log.info("Wrote metadata errors");
            } catch (Exception e) {
                log.error("Failed to write meta errors metaErrorsFile", e);
            }
        }
    }

    private File getMetaErrorsFile() throws IOException {
        log.info("getMetaErrors()");
        Path metaErrorsLocation = Path.of(metaErrorsDirectory, dateFormatter.format(clockService.localDate()));
        log.info("metaErrorsLocation={}", metaErrorsLocation);
        if (!metaErrorsLocation.toFile().exists()) {
            if (!metaErrorsLocation.toFile().mkdirs()) {
                throw new IOException("Unable to create meta errors directory or one of its parents: ".concat(metaErrorsLocation.toString()));
            }
        }
        Path metaErrorsFile = metaErrorsLocation.resolve(String.format(metaErrorsFileTemplate, timestampFormatter.format(clockService.localDateTime())));
        return metaErrorsFile.toFile();
    }
}
