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

import { Navigate, Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SettingsTabs from './SettingsTabs'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(8, 4),
        display: 'grid',
        rowGap: theme.spacing(0)
    },
    paper: {
        padding: theme.spacing(2)
    }
}))

export default function SettingsPage() {
    const classes = useStyles()

    return (
        <Container className={classes.root} maxWidth='sm'>
            <Routes>
                <Route path='' element={<Navigate to='scan' />} />
                <Route path='*' element={<SettingsTabs />} />
            </Routes>
        </Container>
    )
}
