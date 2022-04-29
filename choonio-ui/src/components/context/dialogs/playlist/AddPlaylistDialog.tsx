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

import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'

import Transition from '../../../../components/transitions/Transition'
import { ignoreClicks } from '../../../../ui/lib/ignore-clicks/ignore-clicks'

interface AddPlaylistDialogProps {
    caption: string
    open: boolean
    onSelect: (playlistName: string) => void
    onClose: () => void // deprecated
}

export default function AddPlaylistDialog({ caption, open, onSelect, onClose }: AddPlaylistDialogProps) {
    const [playlistName, setPlaylistName] = useState('')
    const [playlistDescription, setPlaylistDescription] = useState('')

    useEffect(() => {
        if (open) {
            setPlaylistName('')
            setPlaylistDescription('')
        }
    }, [open])

    const handleChangePlaylistName = (event: ChangeEvent<HTMLInputElement>) => setPlaylistName(event.target.value)
    const handleChangePlaylistDescription = (event: ChangeEvent<HTMLInputElement>) => setPlaylistDescription(event.target.value)

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') handleConfirm()
    }

    const handleClose = () => onClose()
    const handleConfirm = () => onSelect(playlistName)

    return (
        <Dialog
            onClose={handleClose}
            onClick={ignoreClicks}
            fullWidth
            aria-labelledby='add-playlist-dialog'
            open={open}
            TransitionComponent={Transition}
        >
            <DialogTitle id='add-playlist-dialog'>{caption}</DialogTitle>
            <DialogContent>
                <DialogContentText>Enter a name for the new playlist here.</DialogContentText>
                <TextField
                    autoFocus
                    margin='dense'
                    id='playlistName'
                    label='Name'
                    type='text'
                    fullWidth
                    value={playlistName}
                    onChange={handleChangePlaylistName}
                    onKeyDown={handleKeyDown}
                />
                <TextField
                    margin='dense'
                    id='playlistDescription'
                    label='Description'
                    type='text'
                    fullWidth
                    value={playlistDescription}
                    onChange={handleChangePlaylistDescription}
                    onKeyDown={handleKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color='primary'>
                    Add to Playlist
                </Button>
            </DialogActions>
        </Dialog>
    )
}
