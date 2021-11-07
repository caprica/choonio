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

import { ListSubheader } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AppBar from '@mui/material/AppBar'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { MdAdd, MdPlaylistPlay } from 'react-icons/md'

import PlaylistsDrawerListItem from './PlaylistsDrawerListItem'
import { usePlaylistActions } from '../../../hooks/actions/usePlaylistActions'
import { useGetPlaylistNames } from '../../../api/endpoints/playlists-controller'
import { useGetRecentPlaylists } from '../../../api/endpoints/recents-controller'
import { RecentData } from '../../../api/model/recents-model'
import { MediaType, PlaylistIdentity } from '../../../api/model/identity-model'
import { useGetAutoPlaylistNames } from '../../../api/endpoints/auto-playlists-controller'

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '280px'
    },
    appBar: {},
    addPlaylistButton: {
        marginLeft: theme.spacing(2)
    },
    header: {
        marginRight: theme.spacing(0.5),
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center'
    }
}))

interface PlaylistDrawerProps {
    open: boolean
    onClose: () => void
}

export default function PlaylistsDrawer({ open, onClose }: PlaylistDrawerProps) {
    const classes = useStyles()

    const { playPlaylist } = usePlaylistActions()

    const { data: autoPlaylists } = useGetAutoPlaylistNames()
    const { data: playlists } = useGetPlaylistNames()
    const { data: recentPlaylists } = useGetRecentPlaylists()

    if (!autoPlaylists || !playlists || !recentPlaylists) return null

    const select = (target: () => void) => () => {
        onClose()
        target()
    }

    const selectAutoPlaylist = (_autoPlaylistName: string) => () => {
        onClose()
        // playAutoPlaylist({ type: MediaType.AutoPlaylist, autoPlaylistName })
    }

    const selectPlaylist = (playlistName: string) => () => {
        onClose()
        playPlaylist({ type: MediaType.Playlist, playlistName })
    }

    const recents = recentPlaylists.slice(0, 5)

    const autoPlaylistNames: Array<string> = autoPlaylists.map((d: any) => d.mediaId.playlistName)
    const playlistNames: Array<string> = playlists.map((d: any) => d.mediaId.playlistName)

    return (
        <Drawer anchor='right' open={open} onClose={onClose} BackdropProps={{ style: { opacity: 0 } }}>
            <div className={classes.root}>
                <AppBar className={classes.appBar} elevation={0} position='relative'>
                    <Toolbar>
                        <div className={classes.header}>
                            <Typography variant='h6' style={{ flexGrow: 1 }}>
                                Playlists
                            </Typography>
                            <IconButton
                                edge='end'
                                className={classes.addPlaylistButton}
                                color='inherit'
                                aria-label='add playlist'
                                onClick={onClose}
                                size='medium'
                            >
                                <MdAdd />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <List disablePadding>
                    <ListSubheader component='div'>Auto-playlists</ListSubheader>
                    {autoPlaylistNames.map(autoPlaylist => (
                        <PlaylistsDrawerListItem
                            key={autoPlaylist}
                            icon={MdPlaylistPlay}
                            text={autoPlaylist}
                            onClick={selectAutoPlaylist(autoPlaylist)}
                        />
                    ))}
                    {/* <PlaylistsDrawerListItem icon={MdThumbUp} text='Thumbs up' onClick={select(gotoPlaylists)} />
                    <PlaylistsDrawerListItem icon={MdMusicNote} text='Most listens' onClick={select(gotoPlaylists)} /> */}
                    <Divider />
                    <ListSubheader component='div'>Recent playlists</ListSubheader>
                    {recents.map((recent: RecentData) => {
                        const playlist = recent.mediaId as PlaylistIdentity
                        return (
                            <PlaylistsDrawerListItem
                                key={playlist.playlistName}
                                icon={MdPlaylistPlay}
                                text={playlist.playlistName}
                                onClick={selectPlaylist(playlist.playlistName)}
                            />
                        )
                    })}
                    <Divider />
                    <ListSubheader component='div'>Playlists</ListSubheader>
                    {playlistNames.map(playlist => (
                        <PlaylistsDrawerListItem
                            key={playlist}
                            icon={MdPlaylistPlay}
                            text={playlist}
                            onClick={selectPlaylist(playlist)}
                        />
                    ))}
                </List>
            </div>
        </Drawer>
    )
}
