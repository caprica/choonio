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

import makeStyles from '@mui/styles/makeStyles'
import AppBar from '@mui/material/AppBar'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { MdEqualizer, MdFavorite, MdHelp, MdImage, MdViewList } from 'react-icons/md'
import { MdHistory } from 'react-icons/md'
import { MdHome } from 'react-icons/md'
import { MdLibraryMusic } from 'react-icons/md'
import { MdSettings } from 'react-icons/md'
import { MdShowChart } from 'react-icons/md'

import { MdMenu as MenuIcon } from 'react-icons/md'
import { MdQueueMusic } from 'react-icons/md'
import NavigationDrawerListItem from './NavigationDrawerListItem'
import { useNavigation } from '../../../hooks/navigation/useNavigation'

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '280px'
    },
    appBar: {},
    menuButton: {
        marginRight: theme.spacing(2.5)
    },
    header: {
        marginLeft: theme.spacing(0.5),
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center'
    }
}))

interface NavigationDrawerProps {
    open: boolean
    onClose: () => void
}

export default function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
    const classes = useStyles()

    const {
        gotoHome,
        gotoLibrary,
        gotoQueue,
        gotoPlaylists,
        gotoRecent,
        gotoFavourites,
        gotoStatistics,
        gotoSettings,
        gotoEqualizer,
        gotoVisualisation,
        gotoAbout
    } = useNavigation()

    const select = (target: () => void) => () => {
        onClose()
        target()
    }

    return (
        <Drawer anchor='left' open={open} onClose={onClose}>
            <div className={classes.root}>
                <AppBar className={classes.appBar} elevation={0} position='relative'>
                    <Toolbar>
                        <div className={classes.header}>
                            <IconButton
                                edge='start'
                                className={classes.menuButton}
                                color='inherit'
                                aria-label='open drawer'
                                onClick={onClose}
                                size='medium'
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant='h6'>Choonio</Typography>
                        </div>
                    </Toolbar>
                </AppBar>
                <List disablePadding>
                    <NavigationDrawerListItem icon={MdHome} text='Home' onClick={select(gotoHome)} />
                    <NavigationDrawerListItem icon={MdLibraryMusic} text='Music library' onClick={select(gotoLibrary)} />
                    <NavigationDrawerListItem icon={MdQueueMusic} text='Queue' onClick={select(gotoQueue)} />
                    <NavigationDrawerListItem icon={MdViewList} text='Playlists' onClick={select(gotoPlaylists)} />
                    <NavigationDrawerListItem icon={MdHistory} text='Recent' onClick={select(gotoRecent)} />
                    <NavigationDrawerListItem icon={MdFavorite} text='Favourites' onClick={select(gotoFavourites)} />
                    <Divider />
                    <NavigationDrawerListItem icon={MdShowChart} text='Statistics' onClick={select(gotoStatistics)} />
                    <Divider />
                    <NavigationDrawerListItem icon={MdImage} text='Visualisation' onClick={select(gotoVisualisation)} />
                    <Divider />
                    <NavigationDrawerListItem icon={MdEqualizer} text='Audio Equalizer' onClick={select(gotoEqualizer)} />
                    <NavigationDrawerListItem icon={MdSettings} text='Settings' onClick={select(gotoSettings)} />
                    <NavigationDrawerListItem icon={MdHelp} text='Help &amp; feedback' onClick={select(gotoAbout)} />
                </List>
            </div>
        </Drawer>
    )
}
