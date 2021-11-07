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

import { Switch } from '@mui/material'
import Settings from './Settings'
import Setting from './Setting'
import { ChangeEvent, useEffect, useState } from 'react'
import { SettingsTabProps } from './SettingsTabs'

export default function PlaybackSettingsTab({ configuration, onSaveConfiguration }: SettingsTabProps) {
    const [alwaysExcludeThumbsDown, setAlwaysExcludeThumbsDown] = useState(false)

    const handleChangeAlwaysExcludeThumbsDown = (event: ChangeEvent<HTMLInputElement>) =>
        setAlwaysExcludeThumbsDown(event.target.checked)

    const handleBlur = () => {
        onSaveConfiguration({
            ...configuration,
            alwaysExcludeThumbsDown
        })
    }

    useEffect(() => {
        setAlwaysExcludeThumbsDown(configuration.alwaysExcludeThumbsDown)
    }, [configuration])

    return (
        <Settings>
            <Setting caption='Exclude thumbs down' description='Never play a track with a thumbs down rating.'>
                <Switch
                    color='primary'
                    checked={alwaysExcludeThumbsDown}
                    onChange={handleChangeAlwaysExcludeThumbsDown}
                    onBlur={handleBlur}
                    name='checkedA'
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </Setting>
        </Settings>
    )
}
