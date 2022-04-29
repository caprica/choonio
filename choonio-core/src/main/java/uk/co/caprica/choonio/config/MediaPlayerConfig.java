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

package uk.co.caprica.choonio.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import uk.co.caprica.vlcj.factory.MediaPlayerFactory;
import uk.co.caprica.vlcj.player.component.AudioPlayerComponent;

import javax.annotation.PostConstruct;
import java.util.Arrays;

@Configuration
@Slf4j
public class MediaPlayerConfig {

    @Value("${app.player.factoryOptions:#{null}}")
    private String[] factoryOptions;

    @PostConstruct
    private void postConstruct() {
        log.info("factoryOptions={}", Arrays.toString(factoryOptions));
    }

    @Bean
    public MediaPlayerFactory mediaPlayerFactory() {
        return new MediaPlayerFactory(factoryOptions);
    }

    @Bean
    public AudioPlayerComponent audioPlayerComponent(MediaPlayerFactory mediaPlayerFactory) {
        return new AudioPlayerComponent(mediaPlayerFactory);
    }
}
