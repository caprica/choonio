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

// hi!
// this is all work in progress and just an ideas dump...
// so this is going to be like a full-screen playback view with minimal things - no search bar, no menu bars, no nav bars, maybe even hide the controls (at least until mouseover)
// it will show changing artwork maybe with a next previous queue - so large art for current thing, smaller art for played or coming soon
// can have a timer showing how much is left of the current queue and so on
// need to make sure i can route it without the navbar etc
// may need to move it UP another route or something
// while i'm developing it i can live with it just being another page
// may need a new arrt size for largest or best or something
// all the shadow effects seem to hurt performance, maybe disable route transition for this page, and/or the background image

import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import { ArtSize } from '../../../api/model/art-model'
import AlbumCover from '../../../components/covers/AlbumCover'
import { useNowPlaying } from '../../../hooks/server-sent-events/useNowPlaying'
import NeonFrame from './NeonFrame'
import NeonText from './NeonText'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import { MediaType } from '../../../api/model/identity-model'
import { useGetQueue } from '../../../api/endpoints/queue-controller'
import { PlaylistItemData } from '../../../api/model/playlists-model'

// import './pulsate.css'

const useStyles = makeStyles({
    root: {
        // backgroundColor: '#010a01',
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2017/02/12/12/42/wall-2059909_640.png)',
        backgroundSize: 'cover',
        color: 'white',
        display: 'grid',
        gridTemplateAreas: '"content" "content2" "footer"',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto 1fr',
        width: '100vw',
        height: '100vh'
    },
    main: {
        gridArea: 'content',
        overflow: 'hidden',
        overflowY: 'auto'
        // display: 'grid'
    },
    footer: {
        gridArea: 'footer',
        height: '90px!important',
        backgroundColor: '#fff',
        zIndex: 2,
        boxShadow: '0 0 8px rgba(0,0,0,.4)',
        display: 'flex',
        position: 'relative',
        borderTop: '1px solid #e0e0e0'
    },
    onStage: {
        padding: 80,
        alignSelf: 'center',
        justifySelf: 'center',
        display: 'grid',
        gridTemplateAreas: '"cover performer"',
        gridTemplateColumns: 'auto 1fr',
        alignItems: 'start',
        columnGap: '8rem'
    },
    mainImage: {
        // it's somehow one pixel missing from the bottom row of the image
        borderRadius: '2rem',
        marginBottom: '-4px' // WHY!?
    },
    cover: {
        gridArea: 'cover'
    },
    performer: {
        gridArea: 'performer',
        alignSelf: 'center',
        justifySelf: 'start'
    },
    performerText: {
        fontSize: '5.2rem',
        transform: 'rotate(-10deg)',
        textAlign: 'center'
    },
    link: {
        cursor: 'pointer'
    },
    caption: {},
    artistName: {
        fontSize: '0.9em'
    },
    albumName: {
        fontSize: '0.7em'
    },
    trackName: {
        fontSize: '0.8em'
    },
    x: {
        gridArea: 'content2',
        overflow: 'hidden'
    },
    queue: {
        display: 'inline-flex',
        alignItems: 'start',
        marginTop: '4em',
        columnGap: '2em',
        flexWrap: 'nowrap',
        overflow: 'hidden',
        marginLeft: '13em',
        paddingTop: '1.5em',
        paddingBottom: '1.5em'
    },
    queueArt: {
        borderRadius: '1em',
        marginBottom: '-3px' // WHY!?
    },
    queueFrame: {
        borderRadius: '1em'
    },
    next: {
        fontSize: '3em',
        whiteSpace: 'nowrap',
        marginTop: '0.5em',
        marginRight: '1em',
        paddingLeft: '1em'
    }
})

interface NeonTextLinkProps {
    caption: string
    className?: string
    onClick: () => void
}

function NeonTextLink({ caption, className, onClick }: NeonTextLinkProps) {
    const classes = useStyles()

    return (
        <NeonText className={clsx(className, classes.link)}>
            <span className={classes.caption} onClick={onClick}>
                {caption}
            </span>
        </NeonText>
    )
}

export default function ExpoPage() {
    const classes = useStyles()

    const nowPlaying = useNowPlaying()
    const { data: queue } = useGetQueue()

    const { gotoArtist, gotoAlbum, gotoTrack } = useNavigation()

    if (!nowPlaying) return null
    if (!queue) return null

    const trackId = nowPlaying.trackId

    const alreadyPlayed = nowPlaying.queueIndex > 0 ? queue.items.slice(0, nowPlaying.queueIndex).reverse() : []
    const comingUp = nowPlaying.queueIndex < queue.items.length - 1 ? queue.items.slice(nowPlaying.queueIndex + 1) : []

    const handleClickArtist = () => {
        gotoArtist({ type: MediaType.Artist, artistName: trackId.albumArtistName })
    }

    const handleClickAlbum = () => {
        gotoAlbum({ type: MediaType.Album, albumArtistName: trackId.albumArtistName, albumName: trackId.albumName })
    }

    const handleClickTrack = () => gotoTrack(trackId)

    return (
        <div className={classes.root}>
            <div className={classes.main}>
                {nowPlaying && (
                    <div className={classes.onStage}>
                        <NeonFrame className={classes.cover}>
                            <AlbumCover
                                className={classes.mainImage}
                                artistName={trackId.albumArtistName}
                                albumName={trackId.albumName}
                                size={ArtSize.Large}
                            />
                        </NeonFrame>
                        <NeonText className={classes.performer}>
                            <div className={classes.performerText}>
                                <NeonTextLink
                                    className={classes.artistName}
                                    caption={trackId.albumArtistName}
                                    onClick={handleClickArtist}
                                />
                                <NeonTextLink
                                    className={classes.albumName}
                                    caption={trackId.albumName}
                                    onClick={handleClickAlbum}
                                />
                                <NeonTextLink
                                    className={classes.trackName}
                                    caption={trackId.trackName}
                                    onClick={handleClickTrack}
                                />
                            </div>
                        </NeonText>
                    </div>
                )}
            </div>
            <div className={classes.x}>
                <div className={classes.queue}>
                    <NeonText className={classes.next}>Coming up next...</NeonText>
                    {comingUp.map((item: PlaylistItemData) => (
                        <NeonFrame key={item.id} className={classes.queueFrame} glow2>
                            <AlbumCover
                                className={classes.queueArt}
                                artistName={item.track.mediaId.albumArtistName}
                                albumName={item.track.mediaId.albumName}
                                size={ArtSize.Small}
                            />
                        </NeonFrame>
                    ))}
                </div>
                <div className={classes.queue}>
                    <NeonText className={classes.next}>Recently played...</NeonText>
                    {alreadyPlayed.map((item: PlaylistItemData) => (
                        <NeonFrame key={item.id} className={classes.queueFrame} glow2>
                            <AlbumCover
                                className={classes.queueArt}
                                artistName={item.track.mediaId.albumArtistName}
                                albumName={item.track.mediaId.albumName}
                                size={ArtSize.Small}
                            />
                        </NeonFrame>
                    ))}
                </div>
            </div>
            {/* <div className={classes.footer}>&nbsp;</div> */}
        </div>
    )
}
