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

/**
 * Custom database document converters.
 * <p>
 * Used to convert to/from database {@link org.bson.Document} instances to the domain model.
 * <p>
 * Converters are registered in {@link uk.co.caprica.choonio.config.MongoDbConfig#customConversions()}.
 */
@NonNullApi
package uk.co.caprica.choonio.database.converters;

import org.springframework.lang.NonNullApi;
