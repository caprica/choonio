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

/**
 * Domain objects for the public API.
 * <p>
 * All domain objects <strong>must</strong> be immutable.
 * <p>
 * These domain objects are those that may be passed between the web-service endpoints and a calling client.
 * <p>
 * The objects will be marshalled to/from JSON as appropriate.
 * <p>
 * Any domain object that may be included in a list for presentation in the front-end must have an id attribute, or some
 * other attribute that can be used to determine the uniqueness of object instances (e.g. for use in the "key" attribute
 * in React loop iterators).
 */
package uk.co.caprica.choonio.api.model;
