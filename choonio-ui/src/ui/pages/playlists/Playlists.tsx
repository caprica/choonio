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
import ItemGridRenderer from '../../../components/item-grid/renderer/ItemGridRenderer'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import PlaylistRenderer from '../../../components/renderers/item-grid/playlist/PlaylistRenderer'
import { PlaylistData } from '../../../api/model/playlists-model'

interface PlaylistsProps {
    playlists: Array<PlaylistData>
}

export default function Playlists({ playlists }: PlaylistsProps) {
    const { gotoPlaylist } = useNavigation()

    const columns = useItemGridColumns()

    const handleClick = (playlist: PlaylistData) => () => gotoPlaylist(playlist.mediaId)

    return (
        <ItemGrid
            columns={columns}
            columnWidth={200}
            items={playlists}
            renderItem={item => (
                <PlaylistRenderer key={item.id} component={ItemGridRenderer} item={item} onClick={handleClick(item)} />
            )}
        />
    )
}
