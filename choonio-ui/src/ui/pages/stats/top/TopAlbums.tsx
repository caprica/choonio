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

import { useParams } from 'react-router-dom'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'

import ItemChart from '../../../../components/item-chart/ItemChart'
import AlbumListensRenderer from '../../../../components/renderers/item-chart/album/AlbumListensRenderer'
import { dateRangeForPeriod } from '../../../../lib/date-ranges/date-ranges'
import { useGetTopAlbumPlays } from '../../../../api/endpoints/plays-controller'
import { AlbumPlaysData } from '../../../../api/model/plays-model'
import RangeFooter from './RangeFooter'
import { keyForMediaId } from '../../../../api/model/identity-model'
import invariant from 'tiny-invariant'

export default function TopAlbums() {
    const { gotoAlbum } = useNavigation()

    const { top, period } = useParams()
    invariant(top)
    invariant(period)

    const dateRange = dateRangeForPeriod(period)

    const { data } = useGetTopAlbumPlays(Number(top), dateRangeForPeriod(period))

    if (!data) return null

    const handleClickPrimary = (stat: AlbumPlaysData) => () => gotoAlbum(stat.mediaId)

    return (
        <ItemChart
            items={data}
            emptyCaption='Nothing played during this period.'
            renderItem={(item, rank) => (
                <AlbumListensRenderer
                    key={keyForMediaId(item.mediaId)}
                    item={item}
                    rank={rank}
                    onClickPrimary={handleClickPrimary(item)}
                />
            )}
            footer={<RangeFooter dateRange={dateRange} />}
            filename={`top-${top}-albums-${period}`}
        />
    )
}
