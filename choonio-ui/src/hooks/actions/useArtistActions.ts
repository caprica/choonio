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

import { useSnackbar } from 'notistack'
import { useAddToFavourites } from '../../api/endpoints/favourites-controller'
import { useAddToQueue } from '../../api/endpoints/queue-controller'
import { ArtistIdentity } from '../../api/model/identity-model'
import { QueueMode } from '../../api/model/queue-model'
import { useAddToPlaylistDialog } from '../../components/context/dialogs/playlist/AddToPlaylistDialogContext'

export const useArtistActions = () => {
    const addToFavourites = useAddToFavourites()
    const addToQueue = useAddToQueue()
    const { openAddToPlaylistDialog } = useAddToPlaylistDialog()
    const { enqueueSnackbar } = useSnackbar()

    const addArtistToFavourites = (artistId: ArtistIdentity) =>
        addToFavourites(artistId, () => enqueueSnackbar(`Added ${artistId} to favourites`, { variant: 'success' }))

    const addArtistToPlaylist = (artistId: ArtistIdentity) => openAddToPlaylistDialog(artistId)

    const addArtistToQueue = (artistId: ArtistIdentity) =>
        addToQueue({ mediaId: artistId, queueMode: QueueMode.Add }, () =>
            enqueueSnackbar(`Added ${artistId} to queue`, { variant: 'success' })
        )

    const playArtist = (artistId: ArtistIdentity) =>
        addToQueue({ mediaId: artistId, queueMode: QueueMode.Play }, () =>
            enqueueSnackbar(`Playing ${artistId.artistName}`, { variant: 'success' })
        )

    const playArtistNext = (artistId: ArtistIdentity) =>
        addToQueue({ mediaId: artistId, queueMode: QueueMode.PlayNext }, () =>
            enqueueSnackbar(`Playing ${artistId} next`, { variant: 'success' })
        )

    const shuffleArtist = (artistId: ArtistIdentity) =>
        addToQueue({ mediaId: artistId, queueMode: QueueMode.Play, shuffle: true }, () => {
            enqueueSnackbar(`Shuffling ${artistId.artistName}`, { variant: 'success' })
        })

    return { addArtistToFavourites, addArtistToPlaylist, addArtistToQueue, playArtist, playArtistNext, shuffleArtist }
}
