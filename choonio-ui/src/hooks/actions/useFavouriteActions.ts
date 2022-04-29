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
import { useDeleteFavourite } from '../../api/endpoints/favourites-controller'
import { useAddToQueue } from '../../api/endpoints/queue-controller'
import { captionForMediaId, MediaIdentity } from '../../api/model/identity-model'
import { QueueMode } from '../../api/model/queue-model'
import { useAddToPlaylistDialog } from '../../components/context/dialogs/playlist/AddToPlaylistDialogContext'

export const useFavouriteActions = () => {
    const addToQueue = useAddToQueue()
    const removeFromFavourites = useDeleteFavourite()
    const { openAddToPlaylistDialog } = useAddToPlaylistDialog()
    const { enqueueSnackbar } = useSnackbar()

    const addFavouriteToPlaylist = (mediaId: MediaIdentity) => openAddToPlaylistDialog(mediaId)

    const addFavouriteToQueue = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Add }, () =>
            enqueueSnackbar(`Added ${captionForMediaId(mediaId)} to queue`, { variant: 'success' })
        )

    const playFavourite = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Play }, () =>
            enqueueSnackbar(`Playing ${captionForMediaId(mediaId)}`, { variant: 'success' })
        )

    const playFavouriteNext = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.PlayNext }, () =>
            enqueueSnackbar(`Playing ${captionForMediaId(mediaId)} next`, { variant: 'success' })
        )

    const shuffleFavourite = (mediaId: MediaIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Play, shuffle: true }, () => {
            enqueueSnackbar(`Shuffling ${captionForMediaId(mediaId)}`, { variant: 'success' })
        })

    const removeFavourite = (favouriteId: string) => removeFromFavourites(favouriteId)

    return { addFavouriteToPlaylist, addFavouriteToQueue, playFavourite, playFavouriteNext, shuffleFavourite, removeFavourite }
}
