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

import AlbumCover from '../../../covers/AlbumCover'
import ItemGridRenderer from '../../../item-grid/renderer/ItemGridRenderer'
import { ArtSize } from '../../../../api/model/art-model'
import { pluralise } from '../../../../lib/pluralise/pluralise'
import { AlbumData } from '../../../../api/model/albums-model'
import { useAlbumMenu } from '../../../context/menus/album/AlbumMenuContext'
import { useAlbumActions } from '../../../../hooks/actions/useAlbumActions'

interface AlbumRendererProps {
    item: AlbumData
    onClick: () => void
}

export default function AlbumRenderer({ item, onClick }: AlbumRendererProps) {
    const { openAlbumMenu } = useAlbumMenu()

    const { playAlbum } = useAlbumActions()

    const handleClickPlay = () => playAlbum(item.mediaId)

    const handleClickMenu = (anchorEl: HTMLElement) => openAlbumMenu(item, anchorEl)

    return (
        <ItemGridRenderer
            art={
                <AlbumCover artistName={item.mediaId.albumArtistName} albumName={item.mediaId.albumName} size={ArtSize.Medium} />
            }
            primary={item.mediaId.albumName}
            secondary={pluralise('track', item.tracks.length) + ` • ${item.year}`}
            onClick={onClick}
            onClickPlay={handleClickPlay}
            onClickMenu={handleClickMenu}
        />
    )
}
