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

package uk.co.caprica.choonio.domain.requests;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Value;

import java.util.Map;

@Value
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlayerActionRequest {
    PlayerActionType action;
    Map<String, String> data;

    public String value(String key) {
        return data != null ? data.get(key) : null;
    }

    public Integer integerValue(String key) {
        return data != null ? Integer.parseInt(data.get(key)) : null;
    }

    public Float floatValue(String key) {
        return data != null ? Float.parseFloat(data.get(key)) : null;
    }
}
