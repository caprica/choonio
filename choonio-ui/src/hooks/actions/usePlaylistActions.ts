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
import { useRouteMatch } from 'react-router-dom'
import { useAddToFavourites } from '../../api/endpoints/favourites-controller'
import { useDeletePlaylist } from '../../api/endpoints/playlists-controller'
import { useAddToQueue } from '../../api/endpoints/queue-controller'
import { captionForMediaId, PlaylistIdentity } from '../../api/model/identity-model'
import { QueueMode } from '../../api/model/queue-model'
import { useNavigation } from '../navigation/useNavigation'

interface PlaylistNameParams {
    playlistName: string
}

export const usePlaylistActions = () => {
    const addToFavourites = useAddToFavourites()
    const addToQueue = useAddToQueue()
    const deletePlaylist = useDeletePlaylist()
    const { goBack } = useNavigation()
    // const removeMediaFromPlaylist = useRemoveMediaFromPlaylist()
    const { enqueueSnackbar } = useSnackbar()

    const match = useRouteMatch<PlaylistNameParams>('/playlist/:playlistName')

    const addPlaylistToFavourites = (mediaId: PlaylistIdentity) =>
        addToFavourites(mediaId, () =>
            enqueueSnackbar(`Added ${captionForMediaId(mediaId)} to favourites`, { variant: 'success' })
        )

    const addPlaylistToQueue = (mediaId: PlaylistIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Add }, () =>
            enqueueSnackbar(`Added ${captionForMediaId(mediaId)} to queue`, { variant: 'success' })
        )

    const playPlaylist = (mediaId: PlaylistIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Play }, () =>
            enqueueSnackbar(`Playing ${mediaId.playlistName}`, { variant: 'success' })
        )

    const playPlaylistNext = (mediaId: PlaylistIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.PlayNext }, () =>
            enqueueSnackbar(`Playing ${captionForMediaId(mediaId)} next`, { variant: 'success' })
        )

    const removePlaylist = (mediaId: PlaylistIdentity) =>
        deletePlaylist(mediaId.playlistName, () => match?.params.playlistName === mediaId.playlistName && goBack())

    const shufflePlaylist = (mediaId: PlaylistIdentity) =>
        addToQueue({ mediaId, queueMode: QueueMode.Play, shuffle: true }, () => {
            enqueueSnackbar(`Shuffling ${captionForMediaId(mediaId)}`, { variant: 'success' })
        })

    return { addPlaylistToFavourites, addPlaylistToQueue, playPlaylist, playPlaylistNext, removePlaylist, shufflePlaylist }
}
