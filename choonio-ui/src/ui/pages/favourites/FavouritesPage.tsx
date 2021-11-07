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
import { FavouritesGrouping, useFavouritesSettings } from '../../../hooks/settings/useFavouritesSettings'
import TransitionRoute from '../../../main/TransitionRoute'
import FavouritesNav from './FavouritesNav'

import FavouritesGroup from './FavouritesGroup'
import { getFavouriteGroups } from '../../../lib/groups/favourite-groups'
import { useGetFavourites } from '../../../api/endpoints/favourites-controller'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 8)
    }
}))

export interface FavouritesParams {
    // grouping: FavouritesGroup
    grouping: string
}

export default function FavouritesPage() {
    const classes = useStyles()

    const match = useRouteMatch()

    const { favouritesGroup } = useFavouritesSettings()

    return (
        <Container maxWidth='xl' className={classes.root}>
            <Route path={`${match.path}/:grouping`}>
                <FavouritesNav />
            </Route>
            <Switch>
                <Route exact path={`${match.url}`}>
                    <Redirect to={`/favourites/${favouritesGroup}`} />
                </Route>
                <TransitionRoute exact path={`${match.path}/:grouping`} component={Content} />
            </Switch>
        </Container>
    )
}

const Content = () => {
    const { grouping } = useParams<FavouritesParams>()

    const { data: favourites } = useGetFavourites()

    if (!favourites) return null

    const groups = getFavouriteGroups(favourites, grouping as FavouritesGrouping)
    return (
        <div>
            {groups.map(group => (
                <FavouritesGroup key={group.id} caption={group.name} favourites={group.favourites} />
            ))}
        </div>
    )
}
