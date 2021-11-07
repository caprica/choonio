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
import { Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MouseEvent, useState } from 'react'
import Underline from '../section-heading/Underline'
import { BsPlayFill as PlayIcon } from 'react-icons/bs'

const useStyles = makeStyles({
    root: {
        // 'padding': theme.spacing(4, 16),
        // '& h2': {
        //     cursor: 'pointer'
        // }
    },
    boxThing: {
        cursor: 'pointer',
        // backgroundImage: 'url(/api/artists/Signal%20Void/cover-medium.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top'

        // paddingTop: '80%',
        // width: calc((100% - 1px - (var(--column-gutters) * (var(--columns) - 1))) / var(--columns));
        // margin: var(--row-margin) var(--column-gutters) 0 0;
    },
    // it also has the same shadow effect as album covers
    textProtection: {
        border: '1px solid #dcdcdc',
        borderRadius: 2,
        padding: 24,
        width: 300,
        height: 200
        // backgroundImage: 'linear-gradient(to top, rgb(211, 242, 242), rgba(211, 242, 242, 0.5))'
        // backgroundImage: 'linear-gradient(to top, rgb(16, 16, 64, 1), rgba(211, 242, 242, 0.2))'
        // backgroundImage: 'linear-gradient(to top, rgb(255, 222, 8), rgba(255, 222, 8, 0.5))'
    },
    textProtection2: {
        border: '1px solid #dcdcdc',
        borderRadius: 2,
        padding: 24,
        width: 300,
        height: 200
        // backgroundImage: 'linear-gradient(to top, rgb(211, 242, 242), rgba(211, 242, 242, 0.5))'
        // backgroundImage: 'linear-gradient(to top, rgb(32, 32, 96, 1), rgba(255, 102, 204, 0.5))'
        // backgroundImage: 'linear-gradient(to top, rgb(255, 222, 8), rgba(255, 222, 8, 0.5))'
    },
    textWrapper: {
        width: '100%',
        height: '100%'
    },
    link: {
        textDecoration: 'underline'
    },
    // This is using the non-compact style - the white compact style might be better
    playButtonContainer: {
        transition: 'opacity 0.3s ease-in-out',
        position: 'absolute',
        height: '40px',
        width: '40px',
        right: '24px',
        bottom: '24px',
        borderRadius: '50%',
        opacity: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    playButton: {
        padding: '6px',
        fontSize: '30px',
        // position: 'absolute',
        color: 'white',
        display: 'inline-block',
        // position: 'relative',
        outline: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        zIndex: 100,
        width: '40px',
        height: '40px'
        // boxSizing: 'border-box !important'
    },
    active: {
        color: 'white !important',
        opacity: 1,
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '50%'
        }
    }
})

export interface HighlightRendererProps {
    title: string
    artwork: string
    rgb: Array<number>
    primary: string
    secondary: string
    onClick: () => void
    onClickPlay: () => void
}

export default function HighlightRenderer({
    title,
    artwork,
    rgb,
    primary,
    secondary,
    onClick,
    onClickPlay
}: HighlightRendererProps) {
    const classes = useStyles()

    // let art
    // let backgroundUrl
    // let name

    // switch (highlight.mediaId.type) {
    //     case MediaType.Artist:
    //         if (!highlight.mediaId.artist) throw Error
    //         art = <ArtistCover artistName={highlight.mediaId.artist.artistName} size={ArtSize.Large} />
    //         backgroundUrl = artistCoverUrl(highlight.mediaId.artist.artistName, ArtSize.Large)
    //         name = highlight.mediaId.artist.artistName
    //         break
    //     case MediaType.Album:
    //         if (!highlight.mediaId.album) throw Error
    //         art = (
    //             <AlbumCover
    //                 artistName={highlight.mediaId.album.albumArtistName}
    //                 albumName={highlight.mediaId.album.albumName}
    //                 size={ArtSize.Medium}
    //             />
    //         )
    //         backgroundUrl = albumCoverUrl(
    //             highlight.mediaId.album.albumArtistName,
    //             highlight.mediaId.album.albumName,
    //             ArtSize.Large
    //         )
    //         name = `${highlight.mediaId.album.albumName} by ${highlight.mediaId.album.albumArtistName}`
    //         break
    //     case MediaType.Playlist:
    //         if (!highlight.mediaId.playlist) throw Error
    //         art = <PlaylistCover playlistName={highlight.mediaId.playlist.playlistName} size={ArtSize.Medium} />
    //         backgroundUrl = playlistCoverUrl(highlight.mediaId.playlist.playlistName, ArtSize.Large)
    //         name = `${highlight.mediaId.playlist.playlistName}`
    //         break
    // }

    const [active, setActive] = useState(false)

    const handleEnter = () => setActive(true)
    const handleExit = () => setActive(false)

    // const gradients = [
    //     'linear-gradient(to top, rgb(16, 16, 64, 1), rgba(211, 242, 242, 0.8))',
    //     'linear-gradient(to top, rgb(32, 32, 96, 1), rgba(255, 102, 204, 0.5))',
    //     'linear-gradient(to top, rgb(0, 0, 0, 0.95), rgba(255, 102, 204, 0.4))',
    //     'linear-gradient(to top, rgb(32, 0, 0, 0.95), rgba(32, 0, 0, 0.4))',
    //     'linear-gradient(to top, rgb(0, 0, 0, 1), rgba(0, 0, 0, 0.5))'
    // ]

    // const gradient = gradients[Math.floor(Math.random() * gradients.length)]
    // let gradient = gradients[highlight.message.length % gradients.length]
    // originally i had paddingbomttom 100 on the boxthing

    // it's naive but sorta ok-ish
    //  however i need to somehow know if it's too bright for white text and instead use black text
    //  can that be done mathematically? even crudely?
    let dark = false

    const r = rgb[0]
    const g = rgb[1]
    const b = rgb[2]

    let gradient

    // there's an argument for not having the gradient to be honest
    // it looks great for some things, but poor for others - might be a clever way to do this rather than this naive approach i suppose

    gradient = `linear-gradient(to top, rgb(${r}, ${g}, ${b}, 0.9), rgba(${r}, ${g}, ${b}, 0.4))`
    gradient = `linear-gradient(to top, rgb(${r}, ${g}, ${b}, 0.9), rgba(255, 255, 255, 0.1))`
    gradient = `linear-gradient(to top, rgb(${r}, ${g}, ${b}, 0.9), rgba(0, 0, 0, 0.2))`
    if (r + g + b > 300) dark = true

    const text = dark ? 'black' : '#afb1b4'

    const handlePlayClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onClickPlay()
    }

    return (
        <div
            className={classes.boxThing}
            style={{ backgroundImage: `url("${artwork}")`, marginBottom: 0 }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleExit}
            onClick={onClick}
        >
            <div style={{ position: 'relative' }}>
                <div className={classes.textProtection2} style={{ backgroundImage: `${gradient}` }}>
                    {/* {art && art} */}
                    <div className={classes.textWrapper}>
                        <Typography
                            variant='h5'
                            style={{ fontSize: '24px', color: `${text}`, paddingTop: '60px', fontWeight: 500 }}
                            // style={{ fontSize: '24px', color: 'rgba(255,255,255,1)', paddingTop: '60px', fontWeight: 500 }}
                            // style={{ fontSize: '24px', color: 'rgba(0,0,0,1)', paddingTop: '60px', fontWeight: 500 }}
                        >
                            {title}
                        </Typography>
                        <Underline size='small' />
                        {/* afb1b4 */}
                        <Typography
                            className={clsx({ [classes.link]: active })}
                            variant='subtitle1'
                            // style={{ fontSize: '14px', fontWeight: 500, marginTop: 12, color: 'rgba(0,0,0,0.702)' }}
                            style={{ fontSize: '14px', fontWeight: 500, marginTop: 12, color: `${text}` }}
                        >
                            {primary}
                        </Typography>
                        {/* the inverse colors are just 255,255,255 with the same alpha */}
                        {/* <Typography variant='body2' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.702)' }}> */}
                        <Typography variant='body2' style={{ fontSize: '12px', color: `${text}` }}>
                            {secondary}
                        </Typography>
                    </div>
                </div>
                <div className={clsx({ [classes.active]: active }, classes.playButtonContainer)} onClick={handlePlayClick}>
                    <span className={classes.playButton}>
                        <PlayIcon />
                    </span>
                </div>
            </div>
        </div>
    )
}
