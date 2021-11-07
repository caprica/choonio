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

import { useEffect, useState } from 'react'
import AddPlaylistDialog from '../context/dialogs/playlist/AddPlaylistDialog'
import PlaylistsDialog from './PlaylistsDialog'

interface PlaylistPickerProps {
    caption: string
    open: boolean
    onSelect: (value: string) => void
    onClose: () => void
}

export default function PlaylistPicker({ caption, open, onSelect, onClose }: PlaylistPickerProps) {
    const [showPlaylists, setShowPlaylists] = useState(true)

    const [showAddPlaylist, setShowAddPlaylist] = useState(false)

    useEffect(() => {
        if (open === true) {
            setShowPlaylists(true)
            setShowAddPlaylist(false)
        }
    }, [open])

    const handleAddPlaylist = () => {
        setShowPlaylists(false)
        setShowAddPlaylist(true)
    }

    const handleCloseAddPlaylist = () => {
        console.log('PLAYLIST PICKER, CLOSE ADD PLAYLIST, CALL ON CLOSE HANDLER')
        setShowAddPlaylist(false)
        onClose()
    }

    const handleSelect = (playlistName: string) => {
        setShowAddPlaylist(false)
        onSelect(playlistName)
    }

    return (
        <>
            <PlaylistsDialog
                caption={caption}
                open={open && showPlaylists}
                onClose={onClose}
                onSelect={onSelect}
                onAddPlaylist={handleAddPlaylist}
            />
            <AddPlaylistDialog
                caption={caption}
                open={showAddPlaylist}
                onClose={handleCloseAddPlaylist}
                onSelect={handleSelect}
            />
        </>
    )
}
