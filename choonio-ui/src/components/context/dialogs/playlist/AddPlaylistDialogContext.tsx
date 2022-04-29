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

import { ReactNode, useState, createContext, useContext } from 'react'
import { MediaIdentity } from '../../../../api/model/identity-model'

/**
 * Shared context used to open/close the dialog for adding media to a playlist, exposed via the useAddPlaylistDialog hook.
 */
const AddPlaylistDialogContext = createContext({} as AddPlaylistDialogContextType)

interface AddPlaylistDialogContextType {
    openAddPlaylistDialog: (mediaId: MediaIdentity) => void
    closeAddPlaylistDialog: () => void
}

/**
 * A dialog component used to add a particular media item to a selected playlist.
 *
 * This dialog is factored out to a separate "global" component and shared so that a single instance may be re-used rather than
 * creating potentially hundreds of such instances (e.g. one per media item in a view).
 *
 * There are some intricacies here...
 *
 * The 'open' state is independent of the 'mediaId' as we want to ensure correct behaviour of the open/close animated transition.
 *
 *   - If there is no media id, then do not render the dialog at all (impacts first time only).
 *   - If there is a media id, then it is kept regardless of the dialog being open or not (to ensure a valid caption in the
 *     dialog during the animation phase).
 *
 * @param param0 destructured component properties
 */
export function AddPlaylistDialogProvider({ children }: AddPlaylistDialogProps) {
    const [mediaId, setMediaId] = useState<MediaIdentity | undefined>(undefined)
    const [open, setOpen] = useState(false)

    const openAddPlaylistDialog = (mediaId: MediaIdentity) => {
        setMediaId(mediaId)
        setOpen(true)
    }

    const closeAddPlaylistDialog = () => setOpen(false)

    return (
        <AddPlaylistDialogContext.Provider value={{ openAddPlaylistDialog, closeAddPlaylistDialog }}>
            {children}
            {/* {mediaId && <AddPlaylistDialog mediaId={mediaId} open={open} />} */}
        </AddPlaylistDialogContext.Provider>
    )
}

interface AddPlaylistDialogProps {
    children: ReactNode
}

export const useAddPlaylistDialog = () => useContext(AddPlaylistDialogContext)
