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

import makeStyles from '@mui/styles/makeStyles'
import Container from '@mui/material/Container'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import { getRecentGroups } from '../../../lib/groups/recent-groups'
import RecentsNav from './RecentsNav'
import TransitionRoute from '../../../main/TransitionRoute'
import { RecentsGrouping, useRecentsSettings } from '../../../hooks/settings/useRecentsSettings'
import RecentsGroup from './RecentsGroup'
import { useGetRecents } from '../../../api/endpoints/recents-controller'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 8)
    }
}))

export interface RecentsPageParams {
    grouping: string
}

export default function RecentsPage() {
    const classes = useStyles()
    const match = useRouteMatch()

    const { recentsGroup } = useRecentsSettings()

    return (
        <Container maxWidth='xl' className={classes.root}>
            <Route path={`${match.path}/:grouping`}>
                <RecentsNav />
            </Route>
            <Switch>
                <Route exact path={`${match.url}`}>
                    <Redirect to={`/recent/${recentsGroup}`} />
                </Route>
                <TransitionRoute exact path={`${match.path}/:grouping`} component={Content} />
            </Switch>
        </Container>
    )
}

const Content = () => {
    const { grouping } = useParams<RecentsPageParams>()

    const { data: recents } = useGetRecents()

    if (!recents) return null

    const groups = getRecentGroups(recents, grouping as RecentsGrouping)
    return (
        <div>
            {groups.map(group => (
                <RecentsGroup key={group.id} caption={group.name} recents={group.recents} />
            ))}
        </div>
    )
}
