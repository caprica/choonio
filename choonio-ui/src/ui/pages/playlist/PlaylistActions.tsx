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

import { Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import IconButton from '@mui/material/IconButton'
import { MdMoreVert, MdShuffle } from 'react-icons/md'

import { usePlaylistMenu } from '../../../components/context/menus/playlist/PlaylistMenuContext'
import { usePlaylistActions } from '../../../hooks/actions/usePlaylistActions'
import { PlaylistData } from '../../../api/model/playlists-model'

const useStyles = makeStyles({
    root: {
        color: 'rgba(0, 0, 0, 0.87)'
    },
    action: {
        marginLeft: '-6px',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 600,
        textTransform: 'uppercase',
        columnGap: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        '& svg': {
            fontSize: '16px'
        }
    },
    iconButton: {
        fontSize: '14px',
        padding: 8,
        color: 'rgba(0, 0, 0, 0.87)',
        '& svg': {
            width: 20,
            height: 20
        },
        height: 36
    }
})

interface PlaylistActionsProps {
    playlist: PlaylistData
}

export default function PlaylistActions({ playlist }: PlaylistActionsProps) {
    const classes = useStyles()

    const { shufflePlaylist } = usePlaylistActions()

    const { openPlaylistMenu } = usePlaylistMenu()

    const handleShuffle = () => shufflePlaylist(playlist.mediaId)

    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => openPlaylistMenu(playlist, event.currentTarget)

    return (
        <div className={classes.root}>
            <div className={classes.action}>
                <Button className={classes.iconButton} startIcon={<MdShuffle />} onClick={handleShuffle}>
                    Shuffle
                </Button>
                <IconButton className={classes.iconButton} onClick={handleClickMenu} size='large'>
                    <MdMoreVert />
                </IconButton>
            </div>
        </div>
    )
}
