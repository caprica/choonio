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

package uk.co.caprica.choonio.api.model.configuration;

import lombok.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("configuration")
@Value
public class ApplicationConfiguration {
    @Id String id;
    List<String> mediaRoots;
    List<String> fileExtensions;
    String coverFilename;
    boolean alwaysExcludeThumbsDown;

    public static ApplicationConfiguration applicationConfiguration(List<String> mediaRoots, List<String> fileExtensions, String coverFilename, boolean alwaysExcludeThumbsDown) {
        return new ApplicationConfiguration(
            null,
            mediaRoots,
            fileExtensions,
            coverFilename,
            alwaysExcludeThumbsDown
        );
    }
}
