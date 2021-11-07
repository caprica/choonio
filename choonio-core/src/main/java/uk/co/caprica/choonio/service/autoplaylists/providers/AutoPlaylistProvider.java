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

package uk.co.caprica.choonio.service.autoplaylists.providers;

import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.playlists.PlaylistItem;

import java.time.Instant;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static uk.co.caprica.choonio.api.model.playlists.Playlist.newPlaylist;

/**
 * Specification for a component that provides automatic playlists.
 * <p>
 * The implementing component <strong>must</strong> provide the name of the auto playlist in the {@link Component}
 * annotation.
 */
public interface AutoPlaylistProvider {
    /**
     * Get the provided playlist.
     *
     * @return playlist
     */
    Mono<Playlist> getPlaylist();

    /**
     * Convert a list of track identifiers to a playlist.
     * <p>
     * The duration can <em>not</em> be calculated at this point because we have only track identifiers, not the tracks
     * themselves.
     *
     * @param name playlist name
     * @param description playlist description
     * @param trackIds list of track identifiers
     * @return playlist
     */
    default Mono<Playlist> convertToPlaylist(String name, String description, List<TrackId> trackIds, Instant now) {
        return Mono.just(newPlaylist(new PlaylistId(name), description, now)
            .withUpdated(now)
            .withItems(trackIds.stream()
                .map(PlaylistItem::newPlaylistItem)
                .collect(toList())
            ));
    }
}
