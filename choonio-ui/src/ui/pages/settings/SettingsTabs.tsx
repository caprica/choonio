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

import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Paper, Tab, Tabs } from '@mui/material'
import LibrarySettingsTab from './LibrarySettingsTab'
import PlaybackSettingsTab from './PlaybackSettingsTab'
import ScanSettingsTab from './ScanSettingsTab'
import { useGetConfiguration, useSetConfiguration } from '../../../api/endpoints/configuration-controller'
import { ConfigurationData } from '../../../api/model/configuration-model'
import { useSnackbar } from 'notistack'
import { isEqual } from 'lodash'

export interface SettingsTabProps {
    configuration: ConfigurationData
    onSaveConfiguration: (newConfiguration: ConfigurationData) => void
}

export default function SettingsTabs() {
    const location = useLocation()

    const { enqueueSnackbar } = useSnackbar()

    const { data: configuration } = useGetConfiguration()

    const setConfiguration = useSetConfiguration()

    if (!configuration) return null

    const handleSaveConfiguration = (newConfiguration: ConfigurationData) => {
        if (!isEqual(newConfiguration, configuration)) {
            setConfiguration(newConfiguration, () => {
                enqueueSnackbar('Configuration saved', { variant: 'success' })
            })
        }
    }

    return (
        <>
            <Paper square elevation={3}>
                <Tabs value={location.pathname} variant='fullWidth' indicatorColor='primary'>
                    <Tab label='Scan' component={Link} to='/settings/scan' value='/settings/scan' />
                    <Tab label='Library' component={Link} to='/settings/library' value='/settings/library' />
                    <Tab label='Playback' component={Link} to='/settings/playback' value='/settings/playback' />
                </Tabs>
            </Paper>
            <Routes>
                <Route path='scan' element={<ScanSettingsTab />} />
                <Route
                    path='library'
                    element={<LibrarySettingsTab configuration={configuration} onSaveConfiguration={handleSaveConfiguration} />}
                />
                <Route
                    path='playback'
                    element={<PlaybackSettingsTab configuration={configuration} onSaveConfiguration={handleSaveConfiguration} />}
                />
            </Routes>
        </>
    )
}
