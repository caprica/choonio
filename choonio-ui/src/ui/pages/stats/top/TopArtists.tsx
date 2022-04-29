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
import ArtistListensRenderer from '../../../../components/renderers/item-chart/artist/ArtistListensRenderer'
import { dateRangeForPeriod } from '../../../../lib/date-ranges/date-ranges'
import { useGetTopArtistPlays } from '../../../../api/endpoints/plays-controller'
import { ArtistPlaysData } from '../../../../api/model/plays-model'
import RangeFooter from './RangeFooter'
import { keyForMediaId } from '../../../../api/model/identity-model'
import invariant from 'tiny-invariant'

export default function TopArtists() {
    const { gotoArtist } = useNavigation()

    const { top, period } = useParams()
    invariant(top)
    invariant(period)

    const dateRange = dateRangeForPeriod(period)

    const { data } = useGetTopArtistPlays(Number(top), dateRange)

    if (!data) return null

    const handleClickPrimary = (item: ArtistPlaysData) => () => gotoArtist(item.mediaId)

    return (
        <ItemChart
            items={data}
            emptyCaption='Nothing played during this period.'
            renderItem={(item, rank) => (
                <ArtistListensRenderer
                    key={keyForMediaId(item.mediaId)}
                    item={item}
                    rank={rank}
                    onClickPrimary={handleClickPrimary(item)}
                />
            )}
            footer={<RangeFooter dateRange={dateRange} />}
            filename={`top-${top}-artists-${period}`}
        />
    )
}
