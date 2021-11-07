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

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.web.ResourceProperties;
import org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.RequestPredicate;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.util.Map;

import static org.springframework.boot.web.error.ErrorAttributeOptions.Include.BINDING_ERRORS;
import static org.springframework.boot.web.error.ErrorAttributeOptions.Include.EXCEPTION;
import static org.springframework.boot.web.error.ErrorAttributeOptions.Include.MESSAGE;
import static org.springframework.boot.web.error.ErrorAttributeOptions.Include.STACK_TRACE;
import static org.springframework.boot.web.error.ErrorAttributeOptions.defaults;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;
import static org.springframework.web.reactive.function.server.RequestPredicates.method;
import static org.springframework.web.reactive.function.server.RequestPredicates.path;
import static org.springframework.web.reactive.function.server.RequestPredicates.pathExtension;

/**
 * Reactive web error handler that routes 404 error responses to the <code>index.html</code> page of the single page
 * front-end application.
 * <p>
 * This is required for client-side routing to work with e.g. full page refreshes or deep-linked bookmarks into the
 * application. The client-side routes (managed by something like react-router) do not exist on the server so ordinarily
 * a 404 Not Found error response would be returned.
 * <p>
 * An explicit ordering is set via {@link Order} to ensure that this exception handler runs before those installed
 * automatically by Spring Boot.
 *
 * @see <a href="https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/web/reactive/error/DefaultErrorWebExceptionHandler.java">DefaultErrorWebExceptionHandler.java</a>
 */
@Component
@Order(-100)
@Slf4j
public class SinglePageApplicationErrorHandler extends AbstractErrorWebExceptionHandler {

    /**
     * Name of the attribute in the {@link ErrorAttributes} object that contains the HTTP status code of the error.
     */
    private static final String STATUS_ERROR_ATTRIBUTE = "status";

    /**
     * Backend web services API to exclude from the not found error handling implemented by this component.
     * <p>
     * We do not want requests for not-found API calls to return the single page application html page.
     */
    private static final String API_PATH = "/api/**";

    /**
     * Static resource on the classpath for the root of the single page frontend application.
     * <p>
     * The path referenced here is a classpath resource, and is populated (in this project) by Maven when the choonio-ui
     * module is built (the production build of the frontend React application is copied to the "static" directory in
     * the classpath).
     */
    private static final String TARGET_RESOURCE = "/static/index.html";

    /**
     * Request-matching predicate for the specific sub-set of errors handled by this component.
     * <p>
     * The idea is to ideally only match non-mapped GET requests that would return HTML (as would be expected for an
     * actual page request rather than some asset request) and specifically to exclude any backend web service API path.
     * <p>
     * In practice, the HTML clause in the predicate may not turn out to be all that useful (since e.g. a web service
     * JSON response would still be matched, even though not HTML because a browser will typically accept any media type
     * in the response) - but it does not hurt to include it.
     * <p>
     * This predicate also ignores and missing static assets like CSS, JavaScript and other such resources. This is not
     * always necessary, as such resources are usually bundled with the frontend application, although there are
     * exceptions such as favicons and JSON manifests.
     */
    private static final RequestPredicate REQUEST_PREDICATE = method(HttpMethod.GET)
        .and(path(API_PATH).negate())
        // There may be a better way...
        .and(accept(MediaType.TEXT_HTML))
        .and(pathExtension("jpg").negate())
        .and(pathExtension("png").negate())
        .and(pathExtension("ico").negate())
        .and(pathExtension("css").negate())
        .and(pathExtension("js").negate())
        .and(pathExtension("json").negate())
        .and(pathExtension("woff2").negate());

    public SinglePageApplicationErrorHandler(ErrorAttributes errorAttributes, ApplicationContext applicationContext, ServerCodecConfigurer serverCodecConfigurer) {
        super(errorAttributes, new ResourceProperties(), applicationContext);
        super.setMessageReaders(serverCodecConfigurer.getReaders());
        super.setMessageWriters(serverCodecConfigurer.getWriters());
    }

    @Override
    protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
        return RouterFunctions.route(REQUEST_PREDICATE, request -> {
            Map<String, Object> attributes = errorAttributes.getErrorAttributes(request, defaults()
                .including(
                    EXCEPTION,
                    STACK_TRACE,
                    MESSAGE,
                    BINDING_ERRORS
                )
            );
            log.trace("attributes={}", attributes);
            int status = (int) attributes.get(STATUS_ERROR_ATTRIBUTE);
            log.info("status={}", status);
            if (status == HttpStatus.NOT_FOUND.value()) {
                log.info("not found path: {}", request.path());
                // 200 OK must be returned here (it is NOT a redirect) so that the request path can be used by the
                // client-side router
                return ServerResponse.ok()
                    .body(BodyInserters.fromResource(new ClassPathResource(TARGET_RESOURCE)));
            }
            // Return all other errors as JSON, the desired attributes to include in the response are specified above
            // by including various options in the error attributes map - these options could be enabled/disabled by
            // configuration (as is done by the default error handler installed by Spring Boot), although there is no
            // hard requirement to use the exact same configuration properties as are used by the default error handler
            return ServerResponse.status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(attributes));
        });
    }
}
