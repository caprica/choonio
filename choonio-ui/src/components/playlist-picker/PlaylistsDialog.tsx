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

import { MouseEvent } from 'react'
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AddIcon from '@mui/icons-material/Add'
import { blue } from '@mui/material/colors'
import PlaylistCover from '../covers/PlaylistCover'
import { ArtSize } from '../../api/model/art-model'
import Transition from '../transitions/Transition'
import { ignoreClicks } from '../../ui/lib/ignore-clicks/ignore-clicks'
import { useGetPlaylistNames } from '../../api/endpoints/playlists-controller'

interface PlaylistsDialogProps {
    caption: string
    open: boolean
    onSelect: (value: string) => void
    onAddPlaylist: () => void
    onClose: () => void
}

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600]
    }
})

export default function PlaylistsDialog({ caption, open, onSelect, onAddPlaylist, onClose }: PlaylistsDialogProps) {
    const classes = useStyles()

    const { data } = useGetPlaylistNames()

    const handleClose = (event: any, _reason: string) => {
        event.stopPropagation()
        onClose()
    }

    const handleListItemClick = (value: string) => (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onSelect(value)
    }

    const handleAddPlaylistClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onAddPlaylist()
    }

    if (!data) return null

    const playlistNames: Array<string> = data.map((d: any) => d.mediaId.playlistName)

    return (
        <Dialog
            onClose={handleClose}
            onClick={ignoreClicks}
            // fullWidth
            aria-labelledby='select-playlist-dialog'
            open={open}
            keepMounted
            TransitionComponent={Transition}
        >
            <DialogTitle id='select-playlist-dialog'>{caption}</DialogTitle>
            <List>
                {playlistNames.map(playlistName => (
                    <ListItem button onClick={handleListItemClick(playlistName)} key={playlistName}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar} variant='rounded'>
                                <PlaylistCover playlistName={playlistName} size={ArtSize.Small} />
                                {/* <PersonIcon /> */}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={playlistName} />
                    </ListItem>
                ))}
                <ListItem autoFocus button onClick={handleAddPlaylistClick}>
                    <ListItemAvatar>
                        <Avatar variant='circular'>
                            <AddIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary='Add playlist' />
                </ListItem>
            </List>
        </Dialog>
    )
}
