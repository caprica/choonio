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

import { useSnackbar } from 'notistack'
import { useAddToPlaylistDialog } from '../../components/context/dialogs/playlist/AddToPlaylistDialogContext'
import { useDeleteRecent } from '../../api/endpoints/recents-controller'
import { useAddToFavourites } from '../../api/endpoints/favourites-controller'
import { useAddToQueue } from '../../api/endpoints/queue-controller'
import { captionForMediaId, MediaIdentity } from '../../api/model/identity-model'
import { QueueMode } from '../../api/model/queue-model'

export const useRecentActions = () => {
    const addToFavourites = useAddToFavourites()
    const addToQueue = useAddToQueue()
    const deleteRecent = useDeleteRecent()
    const { openAddToPlaylistDialog } = useAddToPlaylistDialog()
    const { enqueueSnackbar } = useSnackbar()

    const addRecentToFavourites = (mediaId: MediaIdentity) =>
        addToFavourites(mediaId, () =>
            enqueueSnackbar(`Added ${captionForMediaId(mediaId)} to favourites`, { variant: 'success' })
        )

    const addRecentToPlaylist = (mediaId: MediaIdentity) => openAddToPlaylistDialog(mediaId)

    const addRecentToQueue = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Add }, () =>
            enqueueSnackbar(`Added ${captionForMediaId(mediaId)} to queue`, { variant: 'success' })
        )

    const playRecent = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Play }, () =>
            enqueueSnackbar(`Playing ${captionForMediaId(mediaId)}`, { variant: 'success' })
        )

    const playRecentNext = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.PlayNext }, () =>
            enqueueSnackbar(`Playing ${captionForMediaId(mediaId)} next`, { variant: 'success' })
        )

    const removeRecent = (recentId: string) => deleteRecent(recentId)

    const shuffleRecent = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Play, shuffle: true }, () => {
            enqueueSnackbar(`Shuffling ${captionForMediaId(mediaId)}`, { variant: 'success' })
        })

    return {
        addRecentToFavourites,
        addRecentToPlaylist,
        addRecentToQueue,
        playRecent,
        playRecentNext,
        removeRecent,
        shuffleRecent
    }
}
