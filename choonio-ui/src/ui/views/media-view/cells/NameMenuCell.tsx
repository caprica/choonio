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

import clsx from 'clsx'
import { IconButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import MediaViewListCell from '../MediaViewListCell'
import { MdMoreVert } from 'react-icons/md'
import { AlbumTrackData } from '../../../../api/model/albums-model'
import { MouseEvent } from 'react'
import { useTrackActions } from '../../../../hooks/actions/useTrackActions'

const useStyles = makeStyles({
    title: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '40px'
    },
    titleColumn: {
        // width: '100%'    // need to use this, but it slight glitches on the icon change in column 0
    },
    active: {
        cursor: 'pointer',
        backgroundColor: '#eeeeee'
    },
    menuContainer: {
        float: 'right',
        lineHeight: '40px',
        height: '40px',
        opacity: 0,
        padding: 0
    },
    menuActive: {
        opacity: 1
    }
})

interface NameMenuCellProps {
    track: AlbumTrackData
    active?: boolean
    onClickMenu: (item: AlbumTrackData, anchorEl: HTMLElement) => void
}

export default function NameMenuCell({ track, active, onClickMenu }: NameMenuCellProps) {
    const classes = useStyles()

    const { playTrack } = useTrackActions()

    const handleClick = () => playTrack(track.mediaId)

    const handleClickMenu = (event: MouseEvent<HTMLElement>) => onClickMenu(track, event.currentTarget)

    return (
        <MediaViewListCell className={classes.titleColumn} align='left'>
            <div className={clsx(classes.menuContainer, { [classes.menuActive]: active })}>
                <IconButton style={{ fontSize: '24px', padding: 6, color: '#212121' }} onClick={handleClickMenu} size='large'>
                    <MdMoreVert />
                </IconButton>
            </div>
            <div className={classes.title} onClick={handleClick}>
                {track.mediaId.trackName}
            </div>
        </MediaViewListCell>
    )
}
