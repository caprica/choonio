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

import { Link } from 'react-router-dom'
import clsx from 'clsx'

import AlbumCover from '../covers/AlbumCover'

import makeStyles from '@mui/styles/makeStyles'
import { ArtSize } from '../../api/model/art-model'
import { useNowPlaying } from '../../hooks/server-sent-events/useNowPlaying'

/*
 Currently unused, but probably needed...

div.now-playing div.details {
    text-overflow: ellipsis;
    overflow: hidden;
}

div.now-playing div.details .primary {
    font-size: 16px;
}

div.now-playing div.details .secondary {
    height: 18px;
    margin-top: 4px;
    white-space: nowrap;
    width: auto;
    color: #616161;
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
}
*/

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: '16px',
        alignItems: 'center'
    },
    image: {
        '& img': {
            /* block is needed so the image doesn't force a scroll bar by 3px, but it also breaks the box shadow on the border, something weird going on with the shadow anyway */
            /* that is not strictly right, use a white image and you can see it working, so the image is bleeding into the box shadow colour for some reason */
            /* try a solid border as well */
            /* maybe just an optical illusion */
            display: 'block',
            width: '90px',
            height: '90px'
        }
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'nowrap'
        // paddingTop: 10  - only when the actions part is added, need to really clean this up
    },
    track: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        fontSize: '16px',
        color: '#212121',
        whiteSpace: 'nowrap',
        marginBottom: 2
    },
    details: {
        height: '18px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        marginTop: '4px', // not working
        whiteSpace: 'nowrap',
        width: 'auto',
        display: 'inline',
        color: '#616161',
        fontSize: '13px',
        fontWeight: 400,
        //        lineHeight: '16px'
        lineHeight: '20px'
    },
    actions: {
        opacity: '1!important',
        width: 'auto!important',
        marginLeft: '16px',
        display: 'flex',
        alignItems: 'center',
        transition: 'opacity 0.3s ease,width 0.3s step-end',
        flex: 0,
        paddingRight: 16
    },
    detailsContainer: {
        flex: 1
    }
})

interface NowPlayingProps {
    className?: string
}

export default function NowPlaying({ className }: NowPlayingProps) {
    const classes = useStyles()

    const nowPlaying = useNowPlaying()

    if (!nowPlaying) return <div />

    const trackId = nowPlaying.trackId

    return (
        <div className={clsx('now-playing', classes.root, className)}>
            <div className={classes.image}>
                <AlbumCover artistName={trackId.albumArtistName} albumName={trackId.albumName} size={ArtSize.Small} />
            </div>
            <div className={classes.wrapper}>
                {/* content */}
                <div className={classes.detailsContainer}>
                    <div className={classes.track}>{trackId.trackName}</div>
                    <div className={classes.details}>
                        <Link to={`/albums/${trackId.albumArtistName}`}>{trackId.albumArtistName}</Link> -{' '}
                        <Link to={`/albums/${trackId.albumArtistName}/${trackId.albumName}`}>{trackId.albumName}</Link>
                    </div>
                </div>
                {/* need to make sure the icon lines up, it's currently off because of some margin/padding elsewhere */}
                {/* <div className={classes.actions}>
                    <IconButton><MdMoreVert style={{color: '#212121'}}/></IconButton>
                    <div>rating</div>
                </div> */}
            </div>
        </div>
    )
}
