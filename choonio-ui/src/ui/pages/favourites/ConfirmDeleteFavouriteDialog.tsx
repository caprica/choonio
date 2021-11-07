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

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { FavouriteData } from '../../../api/model/favourites-model'
import Transition from '../../../components/transitions/Transition'
import { ignoreClicks } from '../../lib/ignore-clicks/ignore-clicks'

interface ConfirmDeleteFavouriteDialogProps {
    favourite: FavouriteData
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

export default function ConfirmDeleteFavouriteDialog({ favourite, open, onClose, onConfirm }: ConfirmDeleteFavouriteDialogProps) {
    const handleClose = (event: any) => {
        event.stopPropagation()
        onClose()
    }

    if (favourite === undefined) console.log('placeholder')

    return (
        <Dialog
            onClick={ignoreClicks}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            fullWidth
            aria-labelledby='confirm-delete-favourite-dialog-title'
            aria-describedby='confirm-delete-favourite-dialog-description'
        >
            <DialogTitle id='confirm-delete-playlist-favourite-title'>Delete favourite?</DialogTitle>
            <DialogContent>
                <DialogContentText id='confirm-delete-favourite-dialog-description'>
                    Are you sure you want to delete this favourite? This action cannot be undone!
                </DialogContentText>
                <DialogContentText>
                    <b>{/* {favourite.artistName} • {favourite.albumName} */}</b>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color='primary'>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}
