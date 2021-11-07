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

import axios from 'axios'
import { Button, Divider } from '@mui/material'
import Setting from './Setting'
import Settings from './Settings'
import { adminUrl } from '../../../config/service-endpoints'

export default function ScanSettingsTab() {
    const onClickGenerateCatalog = () => axios.post(adminUrl('catalog'))

    return (
        <Settings>
            <Setting caption='Scanning for media files'>
                <p>The directory structure under each media root directory is important.</p>
                <p>Inside each media root directory it is expected to have one sub-directory per artist.</p>
                <p>Inside each artist directory it is expected to have one sub-directory per album.</p>
                <p>
                    Finally, inside each album directory it is expected to have one or more audio files with proper metadata and a
                    base cover art file.
                </p>
                <p>
                    Depending on the size of your media collection, scanning media and preparing artwork can take a significant
                    amount of time.
                </p>
            </Setting>
            <Divider />
            <Setting caption='Regenerate media catalog' description='Scan for media files and regenerate the media catalog.'>
                <Button size='small' color='primary' variant='contained' onClick={onClickGenerateCatalog}>
                    Regenerate Catalog
                </Button>
            </Setting>
        </Settings>
    )
}
