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

import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import { ArtSize } from '../../api/model/art-model'
import { albumCoverUrl } from '../../config/service-endpoints'

const useStyles = makeStyles({
    root: {
        backgroundColor: 'black',
        // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)'
    },
    image: {
        width: '600px',
        height: '120px',
        backgroundSize: 'cover',
        backgroundPositionY: 'center',
        filter: 'brightness(0.9)'
    }
})

interface AlbumBannerProps {
    artistName: string
    albumName: string
    className?: string
}

// Top charts could use this and show the banner for the number 1 spot?

export default function AlbumBanner({ artistName, albumName, className }: AlbumBannerProps) {
    const classes = useStyles()

    const url = albumCoverUrl(artistName, albumName, ArtSize.Large)
    return (
        <div className={classes.root}>
            <div
                aria-label={`Banner for ${albumName} by ${artistName}`}
                className={clsx(classes.image, className)}
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1)), url("${url}")`
                }}
            />
        </div>
    )
}
