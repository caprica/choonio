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

package uk.co.caprica.choonio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import uk.co.caprica.choonio.database.converters.DocumentToAlbumIdConverter;
import uk.co.caprica.choonio.database.converters.DocumentToArtistIdConverter;
import uk.co.caprica.choonio.database.converters.DocumentToPlaylistIdConverter;
import uk.co.caprica.choonio.database.converters.DocumentToTrackIdConverter;

import java.util.List;

@Configuration
public class MongoDbConfig {

    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(List.of(
            new DocumentToArtistIdConverter(),
            new DocumentToAlbumIdConverter(),
            new DocumentToTrackIdConverter(),
            new DocumentToPlaylistIdConverter()
        ));
    }
}
