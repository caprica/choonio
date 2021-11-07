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

import PlaylistRenderer from '../../../components/renderers/item-grid/playlist/PlaylistRenderer'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import CompactItemGridRenderer from '../../../components/item-grid/renderer/CompactItemGridRenderer'
import { useGetPlaylists } from '../../../api/endpoints/playlists-controller'
import { PlaylistData } from '../../../api/model/playlists-model'
import { orderBy } from 'lodash'
import HomeMediaStrip from './HomeMediaStrip'

export default function Playlists() {
    const { gotoPlaylist, gotoPlaylists } = useNavigation()

    const { data } = useGetPlaylists()

    if (!data) return null

    const handleClick = (playlist: PlaylistData) => () => gotoPlaylist(playlist.mediaId)

    const playlists = orderBy(data, p => p.updated, 'desc').slice(0, 10)

    return (
        <HomeMediaStrip
            caption='Playlists'
            items={playlists}
            onClickCaption={gotoPlaylists}
            itemRenderer={(item: PlaylistData) => (
                <PlaylistRenderer key={item.id} component={CompactItemGridRenderer} item={item} onClick={handleClick(item)} />
            )}
            emptyCaption='There are no playlists yet'
        />
    )
}
