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
import { TrackIdentity } from '../../api/model/identity-model'
import { QueueMode } from '../../api/model/queue-model'
import { useAddToPlaylistDialog } from '../../components/context/dialogs/playlist/AddToPlaylistDialogContext'

export const useTrackActions = () => {
    const addToFavourites = useAddToFavourites()
    const addToQueue = useAddToQueue()
    const { openAddToPlaylistDialog } = useAddToPlaylistDialog()
    const { enqueueSnackbar } = useSnackbar()

    const addTrackToFavourites = (trackId: TrackIdentity) =>
        addToFavourites(trackId, () => enqueueSnackbar(`Added ${trackId.trackName} to favourites`, { variant: 'success' }))

    const addTrackToPlaylist = (trackId: TrackIdentity) => openAddToPlaylistDialog(trackId)

    const addTrackToQueue = (trackId: TrackIdentity) =>
        addToQueue({ mediaId: trackId, queueMode: QueueMode.Add }, () =>
            enqueueSnackbar(`Added ${trackId.trackName} to queue`, { variant: 'success' })
        )

    const playTrack = (trackId: TrackIdentity) =>
        addToQueue({ mediaId: trackId, queueMode: QueueMode.Play }, () =>
            enqueueSnackbar(`Playing ${trackId.trackName}`, { variant: 'success' })
        )

    const playTrackNext = (trackId: TrackIdentity) =>
        addToQueue({ mediaId: trackId, queueMode: QueueMode.PlayNext }, () =>
            enqueueSnackbar(`Playing ${trackId.trackName} next`, { variant: 'success' })
        )

    return { addTrackToFavourites, addTrackToPlaylist, addTrackToQueue, playTrack, playTrackNext }
}
