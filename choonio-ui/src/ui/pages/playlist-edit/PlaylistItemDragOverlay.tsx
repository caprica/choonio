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
import { TableRow } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { forwardRef } from 'react'
import { MdDragHandle } from 'react-icons/md'
// import AlbumCell from '../../views/media-view/cells/AlbumCell'
// import ArtistCell from '../../views/media-view/cells/ArtistCell'
// import DurationCell from '../../views/media-view/cells/DurationCell'
// import TrackNumberCell from '../../views/media-view/cells/TrackNumberCell'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import NameCell from '../../views/media-view/cells/NameCell'
import MediaViewListCell from '../../views/media-view/MediaViewListCell'

// export const Item = forwardRef<any>(({ id, ...props }: any, ref: any) => {
//     return (
//         <div {...props} ref={ref}>
//             {id}
//         </div>
//     )
// })

const useStyles = makeStyles({
    row: {
        height: '40px',
        lineHeight: '40px',
        maxHeight: '40px',
        minHeight: '48px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        verticalAlign: 'middle',
        // textIndent: 4
        '& td': {
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        cursor: 'grabbing',
        backgroundColor: '#eeeeee'
    },
    dragHandle: {
        cursor: 'grabbing',
        fontSize: '24px',
        verticalAlign: 'middle'
    },
    secondary: {
        color: '#616161'
    },
    x: {
        width: 50
    }
})

export const PlaylistItemDragOverlay = forwardRef(function Item(props: any, ref: React.Ref<unknown>) {
    const classes = useStyles()

    const item = props.item

    return (
        <Table {...props} ref={ref} className={classes.row}>
            <TableBody>
                <TableRow>
                    <MediaViewListCell className={clsx(classes.secondary, classes.x)} align='right'>
                        <MdDragHandle className={classes.dragHandle} />
                    </MediaViewListCell>
                    <NameCell track={item.track} />
                    {/* <DurationCell track={item.track} />
                    <ArtistCell track={item.track} />
                    <AlbumCell track={item.track} />
                    <MediaViewListCell className={classes.secondary} align='right'>
                        {item.number}
                    </MediaViewListCell>
                    <IconButton onClick={() => alert('asd')}>
                        <MdDelete />
                    </IconButton> */}
                </TableRow>
            </TableBody>
        </Table>
    )
})

export default PlaylistItemDragOverlay
