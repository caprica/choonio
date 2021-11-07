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

import { useNavigation } from '../../../hooks/navigation/useNavigation'
import CompactItemGridRenderer from '../../../components/item-grid/renderer/CompactItemGridRenderer'
import RecentRenderer from '../../../components/renderers/item-grid/recent/RecentRenderer'
import { useGetRecents } from '../../../api/endpoints/recents-controller'
import { RecentData } from '../../../api/model/recents-model'
import HomeMediaStrip from './HomeMediaStrip'

export default function Recents() {
    const { data } = useGetRecents()

    const { gotoMedia, gotoRecent } = useNavigation()

    const handleClick = (recent: RecentData) => () => gotoMedia(recent.mediaId)

    if (!data) return null

    const recents = data.slice(0, 10)

    return (
        <HomeMediaStrip
            caption='Recent Activity'
            items={recents}
            onClickCaption={gotoRecent}
            itemRenderer={(item: RecentData) => (
                <RecentRenderer key={item.id} component={CompactItemGridRenderer} item={item} onClick={handleClick(item)} />
            )}
            emptyCaption='You have not played anything yet'
        />
    )
}
