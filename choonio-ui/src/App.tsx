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

import './App.css'

import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

import theme from './config/theme'
import { SnackbarProvider } from 'notistack'
import { QueryClientProvider } from 'react-query'

import { QueryCache } from 'react-query'
import { QueryClient } from 'react-query'

import { ServerSentEventsProvider } from './hooks/server-sent-events/ServerSentEventsContext'

import StatusInterstitial from './main/StatusInterstitial'
import MainPageTemplate from './main/MainPageTemplate'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigation } from './hooks/navigation/useNavigation'
import { Route, Routes } from 'react-router-dom'
import ExpoPage from './ui/pages/expo/ExpoPage'
import VisualisationPage from './ui/pages/visualisation/VisualisationPage'

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const queryCache = new QueryCache()
const queryClient = new QueryClient({ queryCache })

const useStyles = makeStyles({
    snackbar: {
        bottom: 107
    }
})

function App() {
    const classes = useStyles()

    const { gotoFavourites, gotoHome, gotoLibrary, gotoPlaylists, gotoQueue, gotoRecent, gotoVisualisation } = useNavigation()

    useHotkeys('shift+f', () => gotoFavourites())
    useHotkeys('shift+h, shift+home', () => gotoHome())
    useHotkeys('shift+l', () => gotoLibrary())
    useHotkeys('shift+p', () => gotoPlaylists())
    useHotkeys('shift+q', () => gotoQueue())
    useHotkeys('shift+r', () => gotoRecent())
    useHotkeys('shift+v', () => gotoVisualisation())

    return (
        <QueryClientProvider client={queryClient}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider
                        classes={{ anchorOriginBottomCenter: classes.snackbar }}
                        maxSnack={3}
                        autoHideDuration={3000}
                        disableWindowBlurListener={true}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                    >
                        <ServerSentEventsProvider>
                            <StatusInterstitial>
                                <Routes>
                                    <Route path='/expo' element={<ExpoPage />} />
                                    <Route path='/visualisation' element={<VisualisationPage />} />
                                    <Route path='*' element={<MainPageTemplate />} />
                                </Routes>
                            </StatusInterstitial>
                        </ServerSentEventsProvider>
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </QueryClientProvider>
    )
}

export default App
