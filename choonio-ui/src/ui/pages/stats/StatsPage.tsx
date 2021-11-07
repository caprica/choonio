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
import { useTopStatsSettings } from '../../../hooks/settings/useTopStatsSettings'

import TopStatsPage from './top/TopStatsPage'

export default function StatsPage() {
    const match = useRouteMatch()

    const { topHowMany } = useTopStatsSettings()

    return (
        <Switch>
            <Route exact path={`${match.url}`}>
                <Redirect to={`${match.url}/top/${topHowMany}`} />
            </Route>
            <Route path={`${match.url}/top/:top`} component={TopStatsPage} />
        </Switch>
    )
}
