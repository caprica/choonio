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
import { Redirect, Route, Switch, useLocation } from 'react-router'
import TransitionRoute from './main/TransitionRoute'
import ExpoPage from './ui/pages/expo/ExpoPage'
import MainPageTemplate from './main/MainPageTemplate'

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

    const location = useLocation()

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
                                <Switch location={location} key={location.pathname}>
                                    <Route exact path='/'>
                                        <Redirect to='/home' />
                                    </Route>
                                    <TransitionRoute exact path='/expo' component={ExpoPage} />
                                    <MainPageTemplate />
                                </Switch>
                            </StatusInterstitial>
                        </ServerSentEventsProvider>
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </QueryClientProvider>
    )
}

export default App
