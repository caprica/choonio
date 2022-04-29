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

package uk.co.caprica.choonio.database.converters;

import org.bson.Document;
import org.springframework.core.convert.converter.Converter;
import uk.co.caprica.choonio.api.model.identity.MediaId;

/**
 * Base implementation for a custom converter used when reading media identity objects from the database.
 * <p>
 * This custom conversion is used, not because of the subtype hierarchy of media identities (that would work just fine
 * with the synthetic "_class" field) but because we want the type property for the entity to be written to the database
 * but NOT set back on the object when reading the entity back from the database.
 * <p>
 * If we did not do this custom conversion, we would have to expose a setter on {@link MediaId} for the immutable
 * type property. Clearly that is not desirable.
 *
 * @param <T> type of object to create from a database document object
 */
abstract class BaseDocumentConverter<T> implements Converter<Document, T> {

    /**
     * Get a string value from a database {@link Document}.
     *
     * @param fieldName name of the field containing the value
     * @param document database document that has the value
     * @return string value from the database document
     */
    protected static String string(String fieldName, Document document) {
        return (String) document.get(fieldName);
    }
}
