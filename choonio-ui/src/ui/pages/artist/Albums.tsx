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

import AlbumRenderer from '../../../components/renderers/item-grid/album/AlbumRenderer'
import ItemGrid from '../../../components/item-grid/ItemGrid'
import { useItemGridColumns } from '../../../hooks/item-grid/useItemGridColumns'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import { AlbumData } from '../../../api/model/albums-model'

/**
 * Properties for the component.
 */
interface AlbumsProps {
    albums: Array<AlbumData>
}

/**
 * A component that displays a grid of albums with cover art.
 *
 * @param param0 destructured component properties
 */
export default function Albums({ albums }: AlbumsProps) {
    const { gotoAlbum } = useNavigation()

    const columns = useItemGridColumns()

    const handleClick = (album: AlbumData) => () => gotoAlbum(album.mediaId)

    if (albums.length > 0) {
        return (
            <ItemGrid
                columns={columns}
                columnWidth={200}
                items={albums}
                renderItem={item => <AlbumRenderer key={item.mediaId.albumName} item={item} onClick={handleClick(item)} />}
            />
        )
    }

    return null
}
