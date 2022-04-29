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

package uk.co.caprica.choonio.test;

import lombok.SneakyThrows;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

final public class TestResourceUtils {

    @SneakyThrows
    public static String readJsonResource(Class<?> clazz, String resourceName) {
        try (InputStream in = clazz.getResourceAsStream("json/" + resourceName)) {
            assert in != null;
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    @SneakyThrows
    public static byte[] readImageResource(Class<?> clazz, String resourceName) {
        try (InputStream in = clazz.getResourceAsStream("image/" + resourceName)) {
            assert in != null;
            return in.readAllBytes();
        }
    }

    @SneakyThrows
    public static BufferedImage readBufferedImageResource(Class<?> clazz, String resourceName) {
        try (InputStream in = clazz.getResourceAsStream("image/" + resourceName)) {
            assert in != null;
            return ImageIO.read(in);
        }
    }
}
