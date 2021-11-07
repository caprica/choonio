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

import de.androidpit.colorthief.ColorThief;
import de.androidpit.colorthief.MMCQ;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.art.ArtSize;
import uk.co.caprica.choonio.api.model.highlights.Highlight;
import uk.co.caprica.choonio.database.repositories.HighlightsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;
import uk.co.caprica.choonio.service.albums.Albums;
import uk.co.caprica.choonio.service.art.Art;
import uk.co.caprica.choonio.service.clock.Clock;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;

@Service
@RequiredArgsConstructor
@Slf4j
public class HighlightsService implements Highlights.Service {

    private static final int COLOUR_COUNT = 5;

    private final Albums.Service albumsService;
    private final Art.Service artService;
    private final Clock.Service clockService;

    private final List<HighlightProvider> providers;

    private final HighlightsRepository highlightsRepository;

    private final ServerSentEventManager eventManager;

    @Value("${app.highlights.maxmimumHighlights:9}")
    private int maximumHighlights;

    @Value("${app.highlights.refresh.autoRefreshThresholdMinutes:2}")
    private int autoRefreshThresholdMinutes;

    @Override
    public Flux<Highlight> getHighlights() {
        log.info("getHighlights()");
        return highlightsRepository.findAll();
    }

    @Override
    public Mono<Void> refreshHighlights() {
        log.info("refreshHighlights()");
        return collectCandidateHighlights()
            .map(this::shuffleCandidateHighlights)
            .map(this::selectHighlights)
            .flatMap(this::processSelectedHighlights)
            .then(highlightsChanged());
    }

    private Mono<List<Highlight>> collectCandidateHighlights() {
        log.info("collectCandidateHighlights()");
        return Flux.fromIterable(providers)
            .flatMap(HighlightProvider::getHighlights)
            .distinct(Highlight::getMediaId)
            .collectList();
    }

    private List<Highlight> shuffleCandidateHighlights(List<Highlight> highlights) {
        log.info("shuffleCandidateHighlights(highlights=[{}])", highlights.size());
        List<Highlight> results = new ArrayList<>(highlights);
        Collections.shuffle(results);
        return results;
    }

    private List<Highlight> selectHighlights(List<Highlight> highlights) {
        log.info("selectHighlights(highlights=[{}])", highlights.size());
        Map<String, List<Highlight>> highlightsByGroup = highlights.stream()
            .collect(groupingBy(Highlight::getType));
        // For now we're just picking a sublist of the entire list, we should really pick from each group
        return highlights.subList(0, Math.min(maximumHighlights, highlights.size()));
    }

    private Mono<Void> processSelectedHighlights(List<Highlight> highlights) {
        log.info("processSelectHighlights(highlights=[{}])", highlights.size());
        Instant now = clockService.instant();
        return highlightsRepository.deleteAll()
            .then(Flux.fromIterable(highlights)
                .map(highlight -> highlight.withTimestamp(now))
                .flatMap(this::rgb)
                .flatMap(highlightsRepository::save)
                .then()
            );
    }

    @Override
    public Mono<Boolean> autoRefreshDue() {
        log.info("autoRefreshDue()");
        return highlightsRepository.findFirstByOrderByTimestampDesc()
            .map(Highlight::getTimestamp)
            .map(timestamp -> {
                Instant now = clockService.instant();
                Instant threshold = timestamp.plus(autoRefreshThresholdMinutes, ChronoUnit.MINUTES);
                return now.isAfter(threshold);
            })
            .switchIfEmpty(Mono.just(true));
    }

    // Should probably be pushed to ArtService
    private Mono<Highlight> rgb(Highlight highlight) {
        return artService.getImage(highlight.getMediaId(), ArtSize.LARGE).map(image -> {
            MMCQ.CMap colours = ColorThief.getColorMap(image, COLOUR_COUNT);
            MMCQ.VBox dominantColour = colours.vboxes.get(0);
            int[] rgb = dominantColour.avg(false);
            return highlight.withRgb(rgb);
        });
    }

    private Mono<Void> highlightsChanged() {
        log.info("highlightsChanged()");
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(CollectionType.HIGHLIGHTS));
            return Mono.create(MonoSink::success);
        });
    }
}
