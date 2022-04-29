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

import { TextField } from '@mui/material'
import Settings from './Settings'
import Setting from './Setting'
import { join, split } from '../../../lib/strings/string-utils'
import { ChangeEvent, useEffect, useState } from 'react'
import { SettingsTabProps } from './SettingsTabs'

export default function LibrarySettingsTab({ configuration, onSaveConfiguration }: SettingsTabProps) {
    const [mediaRoots, setMediaRoots] = useState('')
    const [fileExtensions, setFileExtensions] = useState('')
    const [coverFilename, setCoverFilename] = useState('')

    const handleChangeMediaRoots = (event: ChangeEvent<HTMLInputElement>) => setMediaRoots(event.target.value)
    const handleChangeFileExtensions = (event: ChangeEvent<HTMLInputElement>) => setFileExtensions(event.target.value)
    const handleChangeCoverFilename = (event: ChangeEvent<HTMLInputElement>) => setCoverFilename(event.target.value)

    const handleBlur = () => {
        onSaveConfiguration({
            ...configuration,
            mediaRoots: split(mediaRoots),
            fileExtensions: split(fileExtensions),
            coverFilename
        })
    }

    useEffect(() => {
        setMediaRoots(join(configuration.mediaRoots))
        setFileExtensions(join(configuration.fileExtensions))
        setCoverFilename(configuration.coverFilename)
    }, [configuration])

    return (
        <Settings>
            <Setting
                caption='Media root directories'
                description='Set the directories to scan for media files, one directory name per line.'
            >
                <TextField
                    size='small'
                    fullWidth
                    multiline
                    variant='outlined'
                    rows={5}
                    value={mediaRoots}
                    onChange={handleChangeMediaRoots}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: false }}
                />
            </Setting>
            <Setting
                caption='Audio file extensions'
                description='Set the file extensions to search for when scanning for media files, one file extension per line.'
            >
                <TextField
                    size='small'
                    fullWidth
                    multiline
                    variant='outlined'
                    rows={5}
                    value={fileExtensions}
                    onChange={handleChangeFileExtensions}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: false }}
                />
            </Setting>
            <Setting caption='Cover art filename' description='Set the name to use when searching for cover art.'>
                <TextField
                    size='small'
                    fullWidth
                    variant='outlined'
                    value={coverFilename}
                    onChange={handleChangeCoverFilename}
                    onBlur={handleBlur}
                    InputLabelProps={{ shrink: false }}
                />
            </Setting>
        </Settings>
    )
}
