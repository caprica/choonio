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

import { useNavigation } from '../../../hooks/navigation/useNavigation'
import { FavouritesGrouping, useFavouritesSettings } from '../../../hooks/settings/useFavouritesSettings'
import GroupNav from '../../components/group/GroupNav'

const options = [
    { value: FavouritesGrouping.ByDate, caption: 'by date' },
    { value: FavouritesGrouping.ByName, caption: 'by name' },
    { value: FavouritesGrouping.ByType, caption: 'by type' }
]

export default function FavouritesNav() {
    const { gotoFavouritesGroup } = useNavigation()

    const { setFavouritesGroup } = useFavouritesSettings()

    const onSelected = (selectedValue: FavouritesGrouping) => {
        setFavouritesGroup(selectedValue)
        gotoFavouritesGroup(selectedValue)
    }

    return <GroupNav caption='Favourites' options={options} onSelected={onSelected} />
}
