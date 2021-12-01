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
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import uk.co.caprica.choonio.api.model.equalizer.EqualizerPreset;
import uk.co.caprica.choonio.api.model.equalizer.EqualizerState;
import uk.co.caprica.choonio.api.model.request.EnableEqualizerRequest;
import uk.co.caprica.choonio.api.model.request.SetEqualizerRequest;
import uk.co.caprica.choonio.mediaplayer.PlayerComponent;
import uk.co.caprica.vlcj.player.base.Equalizer;

import java.util.List;

@RestController
@RequestMapping("equalizer")
@RequiredArgsConstructor
@Slf4j
public class EqualizerController {

    private final PlayerComponent playerComponent;

    @GetMapping
    public Mono<EqualizerState> getEqualizerState() {
        log.info("getEqualizerState()");
        Equalizer equalizer = playerComponent.getEqualizer();
        if (equalizer != null) {
            return Mono.just(new EqualizerState(equalizer.preamp(), equalizer.amps()));
        } else {
            return Mono.error(new ResponseStatusException(HttpStatus.NO_CONTENT, "Equalizer not enabled"));
        }
    }

    @PutMapping
    public void enableEqualizer(@RequestBody EnableEqualizerRequest enableEqualizerRequest) {
        log.info("enableEqualizer(enableEqualizerRequest={})", enableEqualizerRequest);
        playerComponent.enableEqualizer(enableEqualizerRequest.isEnable());
    }

    @PutMapping("amps")
    public void setEqualizer(@RequestBody SetEqualizerRequest setEqualizerRequest) {
        log.info("setEqualizerRequest(setEqualizerRequest={})", setEqualizerRequest);
        playerComponent.setEqualizer(setEqualizerRequest.getPreamp(), setEqualizerRequest.getBands());
    }

    @GetMapping("presets")
    public Mono<List<EqualizerPreset>> getPresets() {
        log.info("getPresets()");
        return Mono.just(playerComponent.getEqualizerPresets());
    }
}
