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

import { DragOverlay } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'
import PlaylistItem from './PlaylistItem'
import { PlaylistItemDragOverlay } from './PlaylistItemDragOverlay'
import { PlaylistItemData } from '../../../api/model/playlists-model'
import MediaViewDndContext from '../../views/media-view/MediaViewDndContext'

interface PlaylistItemsProps {
    playlistItems: Array<PlaylistItemData>
    onUpdatePlaylist: (items: Array<PlaylistItemData>) => void
}

export default function PlaylistItems({ playlistItems, onUpdatePlaylist }: PlaylistItemsProps) {
    const [items, setItems] = useState(playlistItems)
    const [activeId, setActiveId] = useState(null)

    const handleDragStart = (event: any) => {
        const { active } = event
        // Note that 'active' is NOT a PlaylistItemData
        setActiveId(active.id)
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over.id) {
            const ids = items.map(item => item.id)
            const oldIndex = ids.indexOf(active.id)
            const newIndex = ids.indexOf(over.id)
            playlistUpdated(arrayMove(items, oldIndex, newIndex))
        }
    }

    const handleRemove = (id: string) => playlistUpdated(items.filter(item => item.id !== id))

    const playlistUpdated = (items: Array<PlaylistItemData>) => {
        // Set the items to the local copy first - without this then, for example, any item moved by a drag/drop
        // operation will snap back to its old position before being updated
        setItems(items)
        onUpdatePlaylist(items)
    }

    const activeItem = items.find(item => item.id === activeId)

    return (
        <MediaViewDndContext ids={items.map(item => item.id)} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <>
                {items.map((item: PlaylistItemData, index: number) => (
                    <PlaylistItem key={item.id} number={index + 1} id={item.id} item={item} onRemove={handleRemove} />
                ))}
                <DragOverlay>{activeItem ? <PlaylistItemDragOverlay item={activeItem} /> : null}</DragOverlay>
            </>
        </MediaViewDndContext>
    )
}
