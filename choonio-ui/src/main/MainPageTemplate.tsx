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

import Header from '../components/header/Header'

import PlayerComponent from '../components/player/PlayerComponent'

import MainContent from './MainContent'

import makeStyles from '@mui/styles/makeStyles'

import useScrollTrigger from '@mui/material/useScrollTrigger'

import NavigationDrawer from '../components/drawers/navigation/NavigationDrawer'
import PlaylistsDrawer from '../components/drawers/playlists/PlaylistsDrawer'

import QuickNav from '../components/quick-nav/QuickNav'
import RightNav from '../components/right-nav/RightNav'
import { AnimatePresence } from 'framer-motion'

import DialogProviders from '../components/context/dialogs/DialogProviders'
import MenuProviders from '../components/context/menus/MenuProviders'

import { useState } from 'react'

const useStyles = makeStyles({
    root: {
        backgroundColor: '#f5f5f5',
        display: 'grid',
        gridTemplateAreas: '"header header header" "quick-nav content right-nav" "footer footer footer"',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateRows: 'auto 1fr auto',
        height: '100vh'
    },
    header: {
        gridArea: 'header',
        color: 'white'
    },
    main: {
        gridArea: 'content',
        overflow: 'hidden',
        overflowY: 'auto',
        paddingRight: 72
    },
    quickNav: {
        gridArea: 'quick-nav',
        marginTop: '16px'
    },
    rightNav: {
        gridArea: 'right-nav',
        marginTop: '16px'
    },
    footer: {
        gridArea: 'footer',
        height: '90px!important',
        backgroundColor: '#fff',
        zIndex: 2,
        boxShadow: '0 0 8px rgba(0,0,0,.4)',
        display: 'flex',
        position: 'relative',
        borderTop: '1px solid #e0e0e0'
    }
})

export default function MainPageTemplate() {
    const classes = useStyles()

    const [navDrawerOpen, setNavDrawerOpen] = useState(false)
    const [playlistsDrawerOpen, setPlaylistsDrawerOpen] = useState(false)

    // needs this magic to work, can't just pass a useref
    const [scrollTarget, setScrollTarget] = useState<HTMLElement | undefined>(undefined)
    const scrollTrigger = useScrollTrigger({ disableHysteresis: true, threshold: 0, target: scrollTarget })
    // const scrollTrigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 })

    const handleOpenNavDrawer = () => setNavDrawerOpen(true)
    const handleCloseNavDrawer = () => setNavDrawerOpen(false)

    const handleOpenPlaylistsDrawer = () => setPlaylistsDrawerOpen(true)
    const handleClosePlaylistsDrawer = () => setPlaylistsDrawerOpen(false)

    return (
        <DialogProviders>
            <MenuProviders>
                <div className={classes.root}>
                    <NavigationDrawer open={navDrawerOpen} onClose={handleCloseNavDrawer} />
                    <PlaylistsDrawer open={playlistsDrawerOpen} onClose={handleClosePlaylistsDrawer} />
                    {/* <CssBaseline/> */}
                    <Header
                        className={classes.header}
                        trigger={scrollTrigger}
                        onClickMenu={handleOpenNavDrawer}
                        onClickPlaylists={handleOpenPlaylistsDrawer}
                    />
                    <nav className={classes.quickNav}>
                        <QuickNav />
                    </nav>
                    <AnimatePresence>
                        <main
                            className={classes.main}
                            ref={(node: HTMLElement) => {
                                node && setScrollTarget(node)
                            }}
                        >
                            <MainContent />
                        </main>
                    </AnimatePresence>
                    <nav className={classes.rightNav}>
                        <RightNav />
                    </nav>
                    <footer className={classes.footer}>
                        <PlayerComponent />
                    </footer>
                </div>
            </MenuProviders>
        </DialogProviders>
    )
}
