/* eslint-disable prettier/prettier */
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

import ItemGrid from '../../../components/item-grid/ItemGrid'
import { useItemGridColumns } from '../../../hooks/item-grid/useItemGridColumns'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import ArtistRenderer from '../../components/renderers/artist/ArtistRenderer'
import { ArtistData } from '../../../api/model/artists-model'
import { Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface ArtistsProps {
    artists: Array<ArtistData>
}

export default function Artists({ artists }: ArtistsProps) {
    const { gotoArtist } = useNavigation()

    const columns = useItemGridColumns()

    const handleClick = (artist: ArtistData) => () => gotoArtist(artist.mediaId)

    if (artists.length > 0) {
        return (
            <ItemGrid
                columns={columns}
                columnWidth={200}
                items={artists}
                renderItem={item => (
                    <ArtistRenderer
                        key={item.mediaId.artistName}
                        artistName={item.mediaId.artistName}
                        onClick={handleClick(item)}
                    />
                )}
            />
        )
    }

    return (
        <>
            <Typography variant='body2'>
                Your music library is currently empty, you may need to configure{' '}
                <Link component={RouterLink} to='/settings/library'>
                    library settings
                </Link>{' '}
                and{' '}
                <Link component={RouterLink} to='/settings/scan'>
                    re-scan
                </Link>{' '}
                your media files.
            </Typography>
        </>
    )
}
