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
import { MdPlayArrow } from 'react-icons/md'

const useStyles = makeStyles({
    root: {
        fontSize: '48px',
        cursor: 'pointer'
    },
    rootx: {
        display: 'block',
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: '50%',
        color: 'rgba(0, 0, 0, 0.7)',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#fff'
    },
    pulse: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        zIndex: -1,
        transform: 'scale(1.05)',
        transition: 'transform 0.2s ease'
    },
    content: {
        position: 'relative',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        borderRadius: '50%'
    },
    icon: {
        position: 'relative',
        width: 24,
        height: 24,
        verticalAlign: 'top',
        color: 'rgb(0,0,0,.87)'
    },

    contentX: {
        //seems this background color messes up the hover on the button without the !important
        backgroundColor: 'white !important',
        color: 'black',
        // position: 'absolute',
        // top: -36,
        // right: 10,
        padding: '8px',
        border: '1px solid rgb(0,0,0,0.34)',
        // ideally this with a transition on opacity
        // '&:hover': {
        //     borderWidth: '3px'
        // },
        borderRadius: '50%',
        // opacity: 0,
        // transition: 'opacity 0.3s ease-in-out',
        cursor: 'pointer'
        // '&:hover': {
        //     opacity: 1
        // }
    }
})

interface PlayButtonProps {
    className?: string
    onClick: () => void
}

export default function PlayButton({ className, onClick }: PlayButtonProps) {
    const classes = useStyles()

    return (
        <IconButton className={classes.contentX} onClick={onClick} size='large'>
            <MdPlayArrow style={{ width: 24, height: 24 }} className={clsx(className, classes.root)} />
        </IconButton>
    )
    // return (
    //     <div className={classes.rootx}>
    //         <div className={classes.pulse}></div>
    //         <div className={classes.content}>
    //             <svg className={classes.icon} id="icon" viewBox="0 0 24 24" class="style-scope sj-play-button"><path id="iconPath" d="M7.995,18.9899999 13.68046871,15.4912499 13.68046871,8.49374997 7.995,4.995 Z M13.6804687,15.4912499 19.3659374,11.99249994 19.3659374,11.99249994 13.6804687,8.49374997 Z" class="style-scope sj-play-button"></path></svg>
    //         </div>
    //     </div>
    // )
}
