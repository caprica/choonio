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

package uk.co.caprica.choonio.domain.requests;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class PlayerActionRequestTest {

    private ObjectMapper objectMapper;

    @BeforeEach
    private void setup() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void itSerialisesRequestWithoutData() throws JsonProcessingException {
        PlayerActionRequest request = new PlayerActionRequest(PlayerActionType.PLAY, null);

        String result = objectMapper.writeValueAsString(request);
        assertNotNull(result);
        assertEquals("{\"action\":\"PLAY\"}", result);
    }

    @Test
    void itSerialiseRequestactionWithData() throws JsonProcessingException {
        Map<String, String> data = new HashMap<>();
        data.put("volume", "123");
        PlayerActionRequest request = new PlayerActionRequest(PlayerActionType.SET_VOLUME, data);

        String result = objectMapper.writeValueAsString(request);
        assertEquals("{\"action\":\"SET_VOLUME\",\"data\":{\"volume\":\"123\"}}", result);
    }

    @Test
    void itDeserialisesRequestWithoutData() throws JsonProcessingException {
        String json = "{\"action\":\"PLAY\"}";

        PlayerActionRequest result = objectMapper.readValue(json, PlayerActionRequest.class);
        assertNotNull(result);
        assertEquals(PlayerActionType.PLAY, result.getAction());
    }

    @Test
    void itDeserialisesRequestWithData() throws JsonProcessingException {
        String json = "{\"action\":\"SET_VOLUME\",\"data\":{\"volume\":\"123\"}}";

        PlayerActionRequest result = objectMapper.readValue(json, PlayerActionRequest.class);
        assertNotNull(result);
        assertEquals(PlayerActionType.SET_VOLUME, result.getAction());
        assertEquals(123, result.integerValue("volume"));
    }

    @Test
    void itReturnsStringProperty() {
        PlayerActionRequest request = new PlayerActionRequest(
            PlayerActionType.PLAY,
            Map.of("the key", "the value")
        );
        assertEquals("the value", request.value("the key"));
    }

    @Test
    void itReturnsIntegerProperty() {
        PlayerActionRequest request = new PlayerActionRequest(
            PlayerActionType.PLAY,
            Map.of("the key", "123")
        );
        assertEquals(123, request.integerValue("the key"));
    }

    @Test
    void itReturnsFloatProperty() {
        PlayerActionRequest request = new PlayerActionRequest(
            PlayerActionType.PLAY,
            Map.of("the key", "123.456")
        );
        assertEquals(123.456f, request.floatValue("the key"));
    }

    @Test
    void itReturnsNullWhenPropertyIsNull() {
        PlayerActionRequest request = new PlayerActionRequest(PlayerActionType.PLAY, null);
        assertNull(request.value("nothing"));
    }

    @Test
    void itReturnsNullWhenIntegerPropertyIsNull() {
        PlayerActionRequest request = new PlayerActionRequest(PlayerActionType.PLAY, null);
        assertNull(request.integerValue("nothing"));
    }

    @Test
    void itReturnsNullWhenFloatPropertyIsNull() {
        PlayerActionRequest request = new PlayerActionRequest(PlayerActionType.PLAY, null);
        assertNull(request.floatValue("nothing"));
    }
}
