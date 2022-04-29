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

/*
 * This file is part of Choonio.
 *
 * Choonio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Choonio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Choonio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2020 Caprica Software Limited.
 */

package uk.co.caprica.choonio.api.endpoints;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import uk.co.caprica.choonio.domain.RepeatMode;
import uk.co.caprica.choonio.domain.ShuffleMode;
import uk.co.caprica.choonio.domain.requests.PlayerActionRequest;
import uk.co.caprica.choonio.mediaplayer.PlayerComponent;

@RestController
@RequestMapping("player")
@RequiredArgsConstructor
@Slf4j
public class PlayerController {

    private final PlayerComponent playerComponent;

    @PostMapping("controls")
    public void playerAction(@RequestBody PlayerActionRequest action) {
        log.info("playerAction(action={})", action);
        switch (action.getAction()) {
            case PLAY -> playerComponent.play();
            case PAUSE -> playerComponent.pause();
            case SKIP_NEXT -> playerComponent.skipNext();
            case SKIP_PREVIOUS -> playerComponent.skipPrevious();
            case SET_POSITION -> playerComponent.setPosition(action.floatValue("position"));
            case MUTE -> playerComponent.mute();
            case UNMUTE -> playerComponent.unmute();
            case SET_VOLUME -> playerComponent.setVolume(action.integerValue("volume"));
            case REPEAT_NONE -> playerComponent.repeat(RepeatMode.NO_REPEAT);
            case REPEAT_ONE -> playerComponent.repeat(RepeatMode.REPEAT_ONE);
            case REPEAT_ALL -> playerComponent.repeat(RepeatMode.REPEAT_ALL);
            case SHUFFLE_OFF -> playerComponent.shuffle(ShuffleMode.NO_SHUFFLE);
            case SHUFFLE_ON -> playerComponent.shuffle(ShuffleMode.SHUFFLE);
            default -> throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid action: ".concat(String.valueOf(action.getAction())));
        }
    }
}
