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

import { useNavigation } from '../../../hooks/navigation/useNavigation'
import { PlaylistsGrouping, usePlaylistsSettings } from '../../../hooks/settings/usePlaylistsSettings'
import GroupNav from '../../components/group/GroupNav'

const options = [
    { value: PlaylistsGrouping.ByName, caption: 'by name' },
    { value: PlaylistsGrouping.ByRecentlyCreated, caption: 'by recently created' },
    { value: PlaylistsGrouping.ByRecentlyModified, caption: 'by recently modified' },
    { value: PlaylistsGrouping.ByDuration, caption: 'by duration' }
]

export default function PlaylistsNav() {
    const { gotoPlaylistsGroup } = useNavigation()

    const { setPlaylistsGroup } = usePlaylistsSettings()

    const onSelected = (selectedValue: PlaylistsGrouping) => {
        setPlaylistsGroup(selectedValue)
        gotoPlaylistsGroup(selectedValue)
    }

    return <GroupNav caption='Playlists' options={options} onSelected={onSelected} />
}
