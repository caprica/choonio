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

import PlaylistPicker from '../../../playlist-picker/PlaylistPicker'
import { useAddToPlaylistDialog } from './AddToPlaylistDialogContext'
import { useAddMediaToPlaylist } from '../../../../api/endpoints/playlists-controller'
import { MediaIdentity, MediaType } from '../../../../api/model/identity-model'

interface AddMediaToPlaylistDialogProps {
    mediaId: MediaIdentity
    open: boolean
}

export default function AddMediaToPlaylistDialog({ mediaId, open }: AddMediaToPlaylistDialogProps) {
    const { closeAddToPlaylistDialog } = useAddToPlaylistDialog()

    const addMediaToPlaylist = useAddMediaToPlaylist()

    const handleSelect = (playlistName: string) => {
        closeAddToPlaylistDialog()
        addMediaToPlaylist(playlistName, mediaId)
    }

    const handleClose = () => closeAddToPlaylistDialog()

    return <PlaylistPicker caption={getCaption(mediaId)} open={open} onClose={handleClose} onSelect={handleSelect} />
}

const getCaption = (mediaId: MediaIdentity) => {
    switch (mediaId.type) {
        case MediaType.Artist:
            return `Add all by ${mediaId.artistName} to playlist:`
        case MediaType.Album:
            return `Add album ${mediaId.albumName} by ${mediaId.albumArtistName} to playlist:`
        case MediaType.Track:
            return `Add track ${mediaId.trackName} by ${mediaId.albumArtistName} to playlist:`
        case MediaType.Playlist:
            return `Add playlist ${mediaId.playlistName} to another playlist:`
    }
}
