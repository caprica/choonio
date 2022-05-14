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

import io.netty.handler.codec.http.cors.CorsConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.method.HandlerTypePredicate;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.PathMatchConfigurer;
import org.springframework.web.reactive.config.WebFluxConfigurer;

/**
 * Configuration for WebFlux.
 * <p>
 * All {@link RestController} component request paths are transparently prefixed with "/api/".
 * <p>
 * Crucially, this only affects the controller components and not any other resources that may be requested (like HTML,
 * JavaScript and CSS files).
 * <p>
 * This is important for enabling features like deep-linking for bookmarks and full-page refreshes (it is particularly
 * useful to enable proper client-side routing).
 */
@Configuration
public class WebConfig implements WebFluxConfigurer {

    private static final String API_PATH = "/api";

    @Override
    public void configurePathMatching(PathMatchConfigurer configurer) {
        configurer
            .setUseCaseSensitiveMatch(true)
            .setUseTrailingSlashMatch(false)
            .addPathPrefix(API_PATH, HandlerTypePredicate.forAnnotation(RestController.class));
    }

    @Override
    /**
     * Disable CORS for the graphql endpoint.
     * <p>
     * Ordinarily this configuration would only be enabled for a locally running or development profile, but since this
     * project only uses local running we can just enable it all the time.
     */
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/graphql/**")
            .exposedHeaders(CorsConfiguration.ALL)
            .allowedOrigins(CorsConfiguration.ALL)
            .allowedHeaders(CorsConfiguration.ALL)
            .allowedMethods(CorsConfiguration.ALL);
    }
}
