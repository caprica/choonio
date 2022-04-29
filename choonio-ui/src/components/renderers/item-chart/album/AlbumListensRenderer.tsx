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

import ItemChartRenderer from '../../../item-chart/renderer/ItemChartRenderer'
import AlbumCover from '../../../covers/AlbumCover'
import AlbumListensMeta from '../../../../ui/pages/stats/meta/AlbumListensMeta'
import { ArtSize } from '../../../../api/model/art-model'
import { ListensRendererType } from '../ListensRendererType'
import { AlbumPlaysData } from '../../../../api/model/plays-model'

export default function AlbumListensRenderer({ item, rank, onClickPrimary }: ListensRendererType<AlbumPlaysData>) {
    return (
        <ItemChartRenderer
            item={item}
            rank={rank}
            primary={item.mediaId.albumName}
            art={<AlbumCover artistName={item.mediaId.albumArtistName} albumName={item.mediaId.albumName} size={ArtSize.Small} />}
            meta={<AlbumListensMeta item={item} />}
            onClickPrimary={onClickPrimary}
        />
    )
}
