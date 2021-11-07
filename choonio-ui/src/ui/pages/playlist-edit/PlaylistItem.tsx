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
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TableRow } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MdDelete, MdDragHandle } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'

import { AlbumTrackData } from '../../../api/model/albums-model'
import TrackNumberCell from '../../views/media-view/cells/TrackNumberCell'
import NameCell from '../../views/media-view/cells/NameCell'
import NameMenuCell from '../../views/media-view/cells/NameMenuCell'
import DurationCell from '../../views/media-view/cells/DurationCell'
import ArtistCell from '../../views/media-view/cells/ArtistCell'
import ListensCell from '../../views/media-view/cells/ListensCell'
import AlbumCell from '../../views/media-view/cells/AlbumCell'
import MediaViewListCell from '../../views/media-view/MediaViewListCell'
import MediaViewListItem from '../../views/media-view/MediaViewListItem'

interface PlaylistItemProps {
    track: AlbumTrackData
    onClickMenu: (item: AlbumTrackData, anchorEl: HTMLElement) => void
}

const useStyles = makeStyles({
    row: {
        height: '40px',
        lineHeight: '40px',
        maxHeight: '40px',
        minHeight: '40px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        verticalAlign: 'middle',
        // textIndent: 4
        '& td': {
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        },
        '&:hover': {
            backgroundColor: '#eeeeee'
        }
    },
    dragHandle: {
        cursor: 'grabbing',
        fontSize: '24px',
        verticalAlign: 'middle',
        outline: 'none'
    },
    active: {
        // cursor: 'pointer',
        backgroundColor: '#eeeeee'
    },
    numberColumn: {
        width: '42px'
    },
    secondary: {
        color: '#616161'
    }
})

const x = true

export default function PlaylistItem(props: any) {
    const classes = useStyles()

    const animateLayoutChanges: AnimateLayoutChanges = args =>
        args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        animateLayoutChanges: animateLayoutChanges,
        id: props.id
    })

    const item = props.item

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'none'
    }

    const active = false

    // if you add the listeners to a specific component, like a drag handle, add listeners and attributes to IT rather than the whole row

    const track = item.track

    const handleRemove = () => {
        console.log('handle remove ')
        props.onRemove(item.id)
    }

    if (x) {
        return (
            // need this ref/style to propagate to MediaViewListItem?
            <TableRow
                ref={setNodeRef}
                style={style}
                className={clsx(classes.row, { [classes.active]: active })}
                // className={clsx(classes.row, classes.dragHandle, { [classes.active]: active })}
                // {...attributes}
                // {...listeners}
            >
                <MediaViewListCell className={classes.secondary} align='right'>
                    <MdDragHandle className={classes.dragHandle} {...attributes} {...listeners} />
                </MediaViewListCell>
                <NameCell track={track} />
                <DurationCell track={track} />
                <ArtistCell track={track} />
                <AlbumCell track={track} />
                <MediaViewListCell className={classes.secondary} align='right'>
                    {track.number}
                </MediaViewListCell>
                <IconButton onClick={handleRemove} size='large'>
                    <MdDelete />
                </IconButton>
            </TableRow>
        )
    }

    const onClickMenu = () => false

    return (
        <MediaViewListItem>
            <TrackNumberCell track={track} />
            <NameMenuCell track={track} onClickMenu={onClickMenu} />
            <DurationCell track={track} />
            <ArtistCell track={track} />
            <AlbumCell track={track} />
            <ListensCell track={track} />
            <IconButton onClick={handleRemove} size='large'>
                <MdDelete />
            </IconButton>
        </MediaViewListItem>
    )
}
