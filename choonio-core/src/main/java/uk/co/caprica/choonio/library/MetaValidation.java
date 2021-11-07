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

package uk.co.caprica.choonio.library;

import com.google.common.base.Strings;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import uk.co.caprica.choonio.service.catalog.meta.model.AudioMeta;

import java.util.ArrayList;
import java.util.List;

@Getter
@Slf4j
public final class MetaValidation {

    private final AudioMeta meta;
    private final List<String> errors = new ArrayList<>();

    public MetaValidation(AudioMeta meta) {
        this.meta = meta;
        validate();
    }

    public boolean hasErrors() {
        return !errors.isEmpty();
    }

    private void validate() {
        log.debug("validate(meta={})", meta);
        requiredString(meta.getAlbumArtistName(), "Album Artist Name");
        requiredString(meta.getAlbumName(), "Album Name");
        requiredString(meta.getArtistName(), "Artist Name");
        requiredString(meta.getGenre(), "Genre");
        requiredInteger(meta.getYear(), "Year");
        requiredString(meta.getTrackName(), "Track Name");
        requiredInteger(meta.getTrackNumber(), "Track Number");
    }

    private void requiredString(String value, String fieldName) {
        if (Strings.isNullOrEmpty(value)) {
            errors.add(fieldName.concat(" is missing"));
        }
    }

    private void requiredInteger(Integer value, String fieldName) {
        if (value == null) {
            errors.add(fieldName.concat(" is missing"));
        }
    }
}
