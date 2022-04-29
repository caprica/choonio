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

package uk.co.caprica.choonio.api.endpoints;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.playlists.Playlist;
import uk.co.caprica.choonio.api.model.request.AddToPlaylistRequest;
import uk.co.caprica.choonio.api.model.request.UpdatePlaylistRequest;
import uk.co.caprica.choonio.database.model.values.PlaylistSummary;
import uk.co.caprica.choonio.service.playlists.Playlists;

@RestController
@RequestMapping("playlists")
@RequiredArgsConstructor
@Slf4j
public class PlaylistsController {

    private final Playlists.Service playlistsService;

    @GetMapping
    public Flux<Playlist> getPlaylists() {
        log.info("getPlaylists()");
        return playlistsService.getPlaylists();
    }

    @GetMapping(params = "format=names")
    public Flux<PlaylistSummary> getPlaylistSummaries() {
        log.info("getPlaylistSummaries()");
        return playlistsService.getPlaylistSummaries();
    }

    @GetMapping("{playlistName}")
    public Mono<Playlist> getPlaylist(@PathVariable("playlistName") String playlistName) {
        log.info("getPlaylist(playlistName={})", playlistName);
        return playlistsService.getPlaylist(playlistName)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    @PutMapping("{playlistName}")
    public Mono<Playlist> updatePlaylist(@PathVariable("playlistName") String playlistName, @RequestBody UpdatePlaylistRequest updatePlaylistRequest) {
        log.info("updatePlaylist(playlistName={}, updatePlaylistRequest={})", playlistName, updatePlaylistRequest);
        return playlistsService.updatePlaylist(playlistName, updatePlaylistRequest);
    }

    @DeleteMapping("{playlistName}")
    public Mono<Void> removePlaylist(@PathVariable("playlistName") String playlistName) {
        log.info("removePlaylist(playlistName={})", playlistName);
        return playlistsService.deletePlaylist(playlistName);
    }

    @PostMapping("{playlistName}")
    public Mono<Void> addToPlaylist(@PathVariable("playlistName") String playlistName, @RequestBody AddToPlaylistRequest addToPlaylistRequest) {
        log.info("addToPlaylist(playlistName={}, addToPlaylistRequest={})", playlistName, addToPlaylistRequest);
        return playlistsService.addToPlaylist(playlistName, addToPlaylistRequest.getMediaId());
    }

    @DeleteMapping("{playlistName}/{playlistItemId}")
    public Mono<Void> removeFromPlaylist(@PathVariable("playlistName") String playlistName, @PathVariable("playlistItemId") String playlistItemId) {
        log.info("removeFromPlaylist(playlistName={}, playlistItemId={})", playlistName, playlistItemId);
        return playlistsService.removeFromPlaylist(playlistName, playlistItemId);
    }
}
