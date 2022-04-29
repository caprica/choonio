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
import Container from '@mui/material/Container'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { getRecentGroups } from '../../../lib/groups/recent-groups'
import RecentsNav from './RecentsNav'
import { RecentsGrouping, useRecentsSettings } from '../../../hooks/settings/useRecentsSettings'
import RecentsGroup from './RecentsGroup'
import { useGetRecents } from '../../../api/endpoints/recents-controller'
import invariant from 'tiny-invariant'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 8)
    }
}))

export default function RecentsPage() {
    const classes = useStyles()

    const { recentsGroup } = useRecentsSettings()

    return (
        <Container maxWidth='xl' className={classes.root}>
            <Routes>
                <Route path=':grouping' element={<RecentsNav />} />
            </Routes>
            <Routes>
                <Route path='' element={<Navigate to={recentsGroup} />} />
                <Route path=':grouping' element={<Content />} />
            </Routes>
        </Container>
    )
}

type ParamsType = {
    grouping: RecentsGrouping
}

const Content = () => {
    const { grouping } = useParams<ParamsType>()
    invariant(grouping)

    const { data: recents } = useGetRecents()

    if (!recents) return null

    const groups = getRecentGroups(recents, grouping)
    return (
        <div>
            {groups.map(group => (
                <RecentsGroup key={group.id} caption={group.name} recents={group.recents} />
            ))}
        </div>
    )
}
