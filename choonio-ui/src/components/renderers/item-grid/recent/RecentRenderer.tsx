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

import { ComponentType } from 'react'
import { MediaType } from '../../../../api/model/identity-model'
import { RecentData } from '../../../../api/model/recents-model'
import { ItemGridRendererProps } from '../../../../components/item-grid/renderer/ItemGridRenderer'
import { useRecentActions } from '../../../../hooks/actions/useRecentActions'
import { useRecentMenu } from '../../../context/menus/recent/RecentMenuContext'
import RecentAlbumRenderer from './RecentAlbumRenderer'
import RecentArtistRenderer from './RecentArtistRenderer'
import RecentPlaylistRenderer from './RecentPlaylistRenderer'
import RecentTrackRenderer from './RecentTrackRenderer'

/**
 * Properties for the component.
 */
interface RecentRendererProps {
    component: ComponentType<ItemGridRendererProps>
    item: RecentData
    onClick: () => void
}

/**
 * A component to render a particular type of recent item.
 *
 * @param param0 destructured component properties
 */
export default function RecentRenderer({ component, item, onClick }: RecentRendererProps) {
    const { openRecentMenu } = useRecentMenu()

    const { playRecent } = useRecentActions()

    const handleClickPlay = () => playRecent(item.mediaId)

    const handleClickMenu = (anchorEl: HTMLElement) => openRecentMenu(item, anchorEl)

    switch (item.mediaId.type) {
        case MediaType.Artist:
            return (
                <RecentArtistRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
        case MediaType.Album:
            return (
                <RecentAlbumRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
        case MediaType.Track:
            return (
                <RecentTrackRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
        case MediaType.Playlist:
            return (
                <RecentPlaylistRenderer
                    component={component}
                    item={item}
                    onClick={onClick}
                    onClickPlay={handleClickPlay}
                    onClickMenu={handleClickMenu}
                />
            )
    }
}
