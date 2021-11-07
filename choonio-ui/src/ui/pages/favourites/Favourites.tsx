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

import ItemGrid from '../../../components/item-grid/ItemGrid'
import { useItemGridColumns } from '../../../hooks/item-grid/useItemGridColumns'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import ItemGridRenderer from '../../../components/item-grid/renderer/ItemGridRenderer'
import FavouriteRenderer from '../../../components/renderers/item-grid/favourite/FavouriteRenderer'
import { FavouriteData } from '../../../api/model/favourites-model'

interface FavouritesProps {
    favourites: Array<FavouriteData>
}

export default function Favourites({ favourites }: FavouritesProps) {
    const { gotoMedia } = useNavigation()

    const columns = useItemGridColumns()

    const handleClick = (favourite: FavouriteData) => () => gotoMedia(favourite.mediaId)

    return (
        <ItemGrid
            columns={columns}
            columnWidth={200}
            items={favourites}
            renderItem={item => (
                <FavouriteRenderer key={item.id} component={ItemGridRenderer} item={item} onClick={handleClick(item)} />
            )}
        />
    )
}
