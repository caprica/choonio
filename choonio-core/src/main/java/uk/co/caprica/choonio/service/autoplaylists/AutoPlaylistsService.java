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

package uk.co.caprica.choonio.service.autoplaylists;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.albums.AlbumTrack;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;
import uk.co.caprica.choonio.service.autoplaylists.providers.AutoPlaylistProvider;
import uk.co.caprica.choonio.service.clock.Clock;

import java.util.Map;

import static uk.co.caprica.choonio.database.model.values.PlaylistSummary.newPlaylistSummary;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutoPlaylistsService implements AutoPlaylists.Service {

    private final Clock.Service clockService;

    /**
     * Map of providers, keyed by playlist name, in priority order.
     */
    private final Map<String, AutoPlaylistProvider> providers;

    @Override
    public Flux<PlaylistSummary> getAutoPlaylistSummaries() {
        log.info("getAutoPlaylistSummaries()");
        return Flux.fromIterable(providers.keySet())
            .map(name -> newPlaylistSummary(new PlaylistId(name), clockService.instant()));
    }

    @Override
    public Flux<Playlist> getAutoPlaylists() {
        log.info("getAutoPlaylists()");
        return Flux.fromIterable(providers.values())
            .flatMap(AutoPlaylistProvider::getPlaylist)
            .map(AutoPlaylistsService::withDuration);
    }

    @Override
    public Mono<Playlist> getAutoPlaylist(String autoPlaylistId) {
        log.info("getAutoPlaylist(autoPlaylistId={})", autoPlaylistId);
        AutoPlaylistProvider provider = providers.get(autoPlaylistId);
        if (provider != null) {
            return provider.getPlaylist().map(AutoPlaylistsService::withDuration);
        } else {
            return Mono.empty();
        }
    }

    private static Playlist withDuration(Playlist playlist) {
        int duration = playlist.getItems().stream()
            .map(PlaylistItem::getTrack)
            .map(AlbumTrack::getDuration)
            .reduce(0, Integer::sum);
        return playlist.withDuration(duration);
    }
}
