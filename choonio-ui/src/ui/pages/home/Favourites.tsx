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

import { FavouriteData } from '../../../api/model/favourites-model'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import { useGetFavourites } from '../../../api/endpoints/favourites-controller'
import CompactItemGridRenderer from '../../../components/item-grid/renderer/CompactItemGridRenderer'
import FavouriteRenderer from '../../../components/renderers/item-grid/favourite/FavouriteRenderer'
import HomeMediaStrip from './HomeMediaStrip'

export default function Favourites() {
    const { gotoFavourites, gotoMedia } = useNavigation()
    const { data } = useGetFavourites()

    if (!data) return null

    const favourites = data.slice(0, 10)

    const handleClick = (favourite: FavouriteData) => () => gotoMedia(favourite.mediaId)

    return (
        <HomeMediaStrip
            caption='Favourites'
            items={favourites}
            onClickCaption={gotoFavourites}
            itemRenderer={(item: FavouriteData) => (
                <FavouriteRenderer key={item.id} component={CompactItemGridRenderer} item={item} onClick={handleClick(item)} />
            )}
            emptyCaption='There are no favourites yet'
        />
    )
}
