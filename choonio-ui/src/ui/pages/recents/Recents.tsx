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

import ItemGrid from '../../../components/item-grid/ItemGrid'
import { useItemGridColumns } from '../../../hooks/item-grid/useItemGridColumns'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import ItemGridRenderer from '../../../components/item-grid/renderer/ItemGridRenderer'
import RecentRenderer from '../../../components/renderers/item-grid/recent/RecentRenderer'
import { RecentData } from '../../../api/model/recents-model'

interface RecentsProps {
    recents: Array<RecentData>
}

export default function Recents({ recents }: RecentsProps) {
    const { gotoMedia } = useNavigation()

    const columns = useItemGridColumns()

    const handleClick = (recent: RecentData) => () => gotoMedia(recent.mediaId)

    return (
        <ItemGrid
            columns={columns}
            columnWidth={200}
            items={recents}
            renderItem={item => (
                <RecentRenderer key={item.id} component={ItemGridRenderer} item={item} onClick={handleClick(item)} />
            )}
        />
    )
}
