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

import ArtistCover from '../../../covers/ArtistCover'
import ItemGridRenderer from '../../../item-grid/renderer/ItemGridRenderer'
import { pluralise } from '../../../../lib/pluralise/pluralise'
import { useArtistMenu } from '../../../context/menus/artist/ArtistMenuContext'
import { ArtistData } from '../../../../api/model/artists-model'
import { ArtSize } from '../../../../api/model/art-model'
import { useArtistActions } from '../../../../hooks/actions/useArtistActions'

interface ArtistRendererProps {
    item: ArtistData
    onClick: () => void
}

export default function ArtistRenderer({ item, onClick }: ArtistRendererProps) {
    const { openArtistMenu } = useArtistMenu()

    const { playArtist } = useArtistActions()

    const handleClickPlay = () => playArtist(item.mediaId)

    const handleClickMenu = (anchorEl: HTMLElement) => openArtistMenu(item.mediaId, anchorEl)

    return (
        <ItemGridRenderer
            art={<ArtistCover artistName={item.mediaId.artistName} size={ArtSize.Medium} />}
            primary={item.mediaId.artistName}
            secondary={pluralise('album', item.albums) + ` • ${pluralise('track', item.tracks)}`}
            onClick={onClick}
            onClickPlay={handleClickPlay}
            onClickMenu={handleClickMenu}
        />
    )
}
