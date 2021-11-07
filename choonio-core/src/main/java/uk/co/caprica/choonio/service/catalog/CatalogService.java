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

package uk.co.caprica.choonio.service.catalog;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.configuration.ApplicationConfiguration;
import uk.co.caprica.choonio.database.repositories.AlbumsRepository;
import uk.co.caprica.choonio.domain.ApplicationStatus;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.StatusChanged;
import uk.co.caprica.choonio.library.Library;
import uk.co.caprica.choonio.library.MetaValidation;
import uk.co.caprica.choonio.service.art.ArtService;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;
import uk.co.caprica.choonio.service.configuration.Configuration;
import uk.co.caprica.mediascanner.MediaScanner;
import uk.co.caprica.mediascanner.domain.MediaEntry;
import uk.co.caprica.mediascanner.domain.MediaSet;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static reactor.core.scheduler.Schedulers.boundedElastic;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogService implements Catalog.Service {

    private static final String MATCH_PATTERN_TEMPLATE = "glob:**/*.{%s}";

    private final AlbumsRepository albumsRepository;

    private final ArtService artService;

    private final ServerSentEventManager eventManager;

    private final Configuration.Service configurationService;

    private final MetaErrors metaErrors;

    @Override
    public Mono<Void> loadLibrary() {
        log.info("loadLibrary()");
        eventManager.emit(new StatusChanged(ApplicationStatus.SEARCH_MEDIA));
        // These execute in parallel and wait for completion
        return generateLibrary().flatMap(library ->
            Mono.when(
                replaceLibrary(library),
                generateArtwork(library)
            )
        ).doFinally(signalType -> eventManager.emit(new StatusChanged(ApplicationStatus.READY)));
    }

    private Mono<Library> generateLibrary() {
        log.info("buildLibrary()");
        return configurationService.getConfiguration()
            .flatMap(config -> Mono.fromCallable(() -> generateLibrary(config))
                .subscribeOn(boundedElastic())
            );
    }

    private Library generateLibrary(ApplicationConfiguration config) {
        log.info("generateLibrary(config={})", config);
        String matchPattern = String.format(MATCH_PATTERN_TEMPLATE, String.join(",", config.getFileExtensions()));
        log.info("matchPattern={}", matchPattern);
        try {
            log.info("Collecting meta data...");
            long start = System.currentTimeMillis();
            MediaSet mediaSet = MediaScanner.create()
                .directory(config.getMediaRoots().toArray(new String[0]))
                .matching(matchPattern)
                .findMedia()
                .collectMeta()
                .mediaSet();
            List<AudioMeta> meta = mediaSet.entries()
                .stream()
                .map(entry -> entry.value("audioMeta", AudioMeta.class))
                .sorted(comparing(AudioMeta::getFileName))
                .collect(toList());
            List<AudioMeta> validMetas = validateMeta(meta);
            log.info("Building library from meta data...");
            Library library = new Library(validMetas);
            log.info("Finished collecting meta data.");
            long end = System.currentTimeMillis();
            log.info("Time spent collecting meta data: {} seconds", (end - start) / 1000);
            return library;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private List<AudioMeta> validateMeta(List<AudioMeta> metas) {
        log.info("validateMeta()");
        List<MetaValidation> metaErrors = new ArrayList<>();
        List<AudioMeta> validMetas = new ArrayList<>(metas.size());
        for (AudioMeta meta : metas) {
            MetaValidation validationResult = new MetaValidation(meta);
            if (!validationResult.hasErrors()) {
                validMetas.add(meta);
            } else {
                metaErrors.add(validationResult);
            }
        }
        logMetaErrors(metaErrors);
        return validMetas;
    }

    private Mono<Library> replaceLibrary(Library library) {
        log.info("replaceLibrary()");
        return albumsRepository.deleteAll()
            .then(insertLibrary(library));
    }

    private Mono<Library> insertLibrary(Library library) {
        log.info("insertLibrary()");
        return albumsRepository.saveAll(library.albums())
            .then(Mono.just(library));
    }

    private Mono<Library> generateArtwork(Library library) {
        log.info("generateArtwork()");
        return configurationService.getConfiguration()
            .flatMap(config -> Mono.fromCallable(() -> generateArtwork(library, config))
                .subscribeOn(boundedElastic())
            );
    }

    private Library generateArtwork(Library library, ApplicationConfiguration config) {
        log.info("generateArtwork(config={})", config);
        log.info("Generating artwork...");
        long start = System.currentTimeMillis();
        artService.generateArt(config.getMediaRoots());
        log.info("Finished generating artwork.");
        long end = System.currentTimeMillis();
        log.info("Time spent generating artwork: {} seconds", (end - start) / 1000);
        return library;
    }

    private void logMetaErrors(List<MetaValidation> errors) {
        if (log.isWarnEnabled()) {
            log.info("Meta validation errors:");
            if (errors.isEmpty()) {
                log.info(" none");
            } else {
                for (MetaValidation metaValidation : errors) {
                    log.warn(" {} -> {}", metaValidation.getMeta().getFileName(), metaValidation.getErrors());
                }
            }
        }
        metaErrors.saveMetaErrors(errors);
    }
}
