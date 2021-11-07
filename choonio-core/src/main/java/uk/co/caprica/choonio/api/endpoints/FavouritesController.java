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

package uk.co.caprica.choonio.api.endpoints;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.favourites.Favourite;
import uk.co.caprica.choonio.api.model.request.AddToFavouritesRequest;
import uk.co.caprica.choonio.service.favourites.Favourites;

@RestController
@RequestMapping("favourites")
@RequiredArgsConstructor
@Slf4j
public class FavouritesController {

    private final Favourites.Service favouritesService;

    @GetMapping
    public Flux<Favourite> getFavourites() {
        log.info("getFavourites()");
        return favouritesService.getFavourites();
    }

    @PutMapping
    public Mono<Void> addToFavourites(@RequestBody AddToFavouritesRequest addToFavouritesRequest) {
        log.info("addToFavourites(addToFavouritesRequest={})", addToFavouritesRequest);
        return favouritesService.addToFavourites(addToFavouritesRequest.getMediaId());
    }

    @DeleteMapping
    public Mono<Void> removeAllFavourites() {
        log.info("removeAllFavourites()");
        return favouritesService.removeAllFavourites();
    }

    @DeleteMapping("{favouriteId}")
    public Mono<Void> removeFavourite(@PathVariable("favouriteId") String id) {
        log.info("removeFavourite(id={})", id);
        return favouritesService.removeFavourite(id);
    }
}
