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

import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import { Container } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

import TopArtists from './TopArtists'
import TopAlbums from './TopAlbums'
import TopTracks from './TopTracks'
import TopStatsNav from './TopStatsNav'
import TransitionRoute from '../../../../main/TransitionRoute'
import { TopPeriod, TopWhat, useTopStatsSettings } from '../../../../hooks/settings/useTopStatsSettings'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    link: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}))

export interface TopStatsPageParams {
    top: string
    what: TopWhat
    period: TopPeriod
}

export default function TopStatsPage() {
    const classes = useStyles()

    const { topHowMany, topWhat, topPeriod } = useTopStatsSettings()

    const match = useRouteMatch()

    return (
        <Container className={classes.root} maxWidth='sm'>
            <Route path={`${match.path}/:what/:period`}>
                <TopStatsNav />
            </Route>
            <Switch>
                <Route exact path={`${match.url}`}>
                    <Redirect to={`/stats/top/${topHowMany}/${topWhat}/${topPeriod}`} />
                </Route>
                <Route exact path='/stats/top/:top/artists'>
                    <Redirect to={`/stats/top/${topHowMany}/artists/${topPeriod}`} />
                </Route>
                <Route exact path='/stats/top/:top/albums'>
                    <Redirect to={`/stats/top/${topHowMany}/albums/${topPeriod}`} />
                </Route>
                <Route exact path='/stats/top/:top/tracks'>
                    <Redirect to={`/stats/top/${topHowMany}/tracks/${topPeriod}`} />
                </Route>
                <TransitionRoute exact path={`${match.path}/artists/:period`} component={TopArtists} />
                <TransitionRoute exact path={`${match.path}/albums/:period`} component={TopAlbums} />
                <TransitionRoute exact path={`${match.path}/tracks/:period`} component={TopTracks} />
            </Switch>
        </Container>
    )
}
