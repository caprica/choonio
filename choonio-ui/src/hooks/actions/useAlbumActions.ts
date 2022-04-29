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
import { useAddToFavourites } from '../../api/endpoints/favourites-controller'
import { useAddToQueue } from '../../api/endpoints/queue-controller'
import { AlbumIdentity } from '../../api/model/identity-model'
import { QueueMode } from '../../api/model/queue-model'
import { useAddToPlaylistDialog } from '../../components/context/dialogs/playlist/AddToPlaylistDialogContext'

export const useAlbumActions = () => {
    const addToFavourites = useAddToFavourites()
    const addToQueue = useAddToQueue()
    const { openAddToPlaylistDialog } = useAddToPlaylistDialog()
    const { enqueueSnackbar } = useSnackbar()

    const addAlbumToFavourites = (albumId: AlbumIdentity) =>
        addToFavourites(albumId, () => enqueueSnackbar(`Added ${albumId.albumName} to favourites`, { variant: 'success' }))

    const addAlbumToPlaylist = (albumId: AlbumIdentity) => openAddToPlaylistDialog(albumId)

    const addAlbumToQueue = (albumId: AlbumIdentity) =>
        addToQueue({ mediaId: albumId, queueMode: QueueMode.Add }, () =>
            enqueueSnackbar(`Added ${albumId.albumName} to queue`, { variant: 'success' })
        )

    const playAlbum = (albumId: AlbumIdentity) =>
        addToQueue({ mediaId: albumId, queueMode: QueueMode.Play }, () =>
            enqueueSnackbar(`Playing ${albumId.albumName}`, { variant: 'success' })
        )

    const playAlbumNext = (albumId: AlbumIdentity) =>
        addToQueue({ mediaId: albumId, queueMode: QueueMode.PlayNext }, () =>
            enqueueSnackbar(`Playing ${albumId.albumName} next`, { variant: 'success' })
        )

    const shuffleAlbum = (albumId: AlbumIdentity) =>
        addToQueue({ mediaId: albumId, queueMode: QueueMode.Play, shuffle: true }, () => {
            enqueueSnackbar(`Shuffling ${albumId.albumName} by ${albumId.albumArtistName}`, { variant: 'success' })
        })

    return { addAlbumToFavourites, addAlbumToPlaylist, addAlbumToQueue, playAlbum, playAlbumNext, shuffleAlbum }
}
