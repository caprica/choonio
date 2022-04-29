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

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragStartEvent,
    KeyboardSensor,
    MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { ReactNode } from 'react'

interface MediaViewDndContextProps {
    ids: Array<string>
    children: ReactNode
    onDragStart: (event: DragStartEvent) => void
    onDragEnd: (event: DragEndEvent) => void
}

export default function MediaViewDndContext({ ids, children, onDragStart, onDragEnd }: MediaViewDndContextProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    return (
        <DndContext
            autoScroll={true}
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToParentElement]}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
        </DndContext>
    )
}
