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

package uk.co.caprica.choonio.service.recents;

import com.mongodb.client.result.DeleteResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.MediaType;
import uk.co.caprica.choonio.api.model.recents.Recent;
import uk.co.caprica.choonio.database.repositories.RecentsRepository;
import uk.co.caprica.choonio.events.ServerSentEventManager;
import uk.co.caprica.choonio.events.model.CollectionChanged;
import uk.co.caprica.choonio.events.model.CollectionType;

import static org.springframework.data.mongodb.core.query.Query.query;
import static uk.co.caprica.choonio.database.criteria.MediaIdCriteria.mediaIdCriteria;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecentsService implements Recents.Service {

    private final RecentsRepository recentsRepository;

    private final ServerSentEventManager eventManager;

    private final ReactiveMongoTemplate mongoTemplate;

    @Override
    public Flux<Recent> getAllRecents() {
        log.info("getAllRecents()");
        return recentsRepository.findAllByOrderByTimestampDesc();
    }

    @Override
    public Flux<Recent> getRecents(MediaType type, Integer limit) {
        log.info("getRecents(type={}, limit={})", type, limit);
        Flux<Recent> recents;
        if (type == null) {
            recents = recentsRepository.findAllByOrderByTimestampDesc();
        } else {
            recents = recentsRepository.findAllByMediaIdTypeOrderByTimestampDesc(type);
        }
        recents = recents.distinct(Recent::getMediaId);
        if (limit != null) {
            recents = recents.take(limit, true);
        }
        return recents;
    }

    @Override
    public Mono<Recent> addRecent(Recent recent) {
        log.info("addRecent(recent={})", recent);
        return recentsRepository.save(recent)
            .flatMap(addedRecent -> recentsChanged()
                .thenReturn(addedRecent)
            );
    }

    @Override
    public Mono<Void> removeRecent(String recentId) {
        log.info("removeRecent(recentId={})", recentId);
        return recentsRepository.findById(recentId)
            .flatMapMany(recent -> removeAllRecentsOfMediaId(recent.getMediaId()))
            .flatMap(unused -> recentsChanged())
            .then();
    }

    private Mono<DeleteResult> removeAllRecentsOfMediaId(MediaId mediaId) {
        log.info("removeAllRecentsOfMediaId(mediaId={})", mediaId);
        Criteria criteria = mediaIdCriteria(mediaId);
        return mongoTemplate.remove(query(criteria), Recent.class);
    }

    private Mono<Void> recentsChanged() {
        log.info("recentsChanged()");
        return Mono.defer(() -> {
            eventManager.emit(new CollectionChanged(CollectionType.RECENTS));
            return Mono.create(MonoSink::success);
        });
    }
}
