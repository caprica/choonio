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

import { MouseEvent } from 'react'
import clsx from 'clsx'

import Typography from '@mui/material/Typography'

import { IconButton } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

import { MdMoreVert, MdPlayArrow } from 'react-icons/md'
import { ItemGridRendererProps } from './ItemGridRenderer'

// Without the zIndex, when hovering a title that overflows to an adjacent item, it will flicker/alternate render the detail text between both items
const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '90px',
        gridTemplateRows: '90px auto',
        rowGap: '12px',
        cursor: 'pointer',
        '& img': {
            width: 90,
            height: 90
        },
        '&:hover :nth-child(2)': {
            opacity: 1
        },
        '&:hover button': {
            opacity: 1
        },
        zIndex: 1
    },
    cover: {
        position: 'relative',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, .12)',
        '&:hover': {
            // boxShadow: '0 4px 4px 0 rgba(0,0,0,0.27)',
            boxShadow: '0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
            transition: 'box-shadow 0.28s cubic-bezier(0.4,0,0.2,1)'
        }
        // '&:hover + div': {
        //     opacity: 1
        // },
    },
    detail: {
        minHeight: '2rem',
        opacity: 0,
        whiteSpace: 'nowrap',
        overflow: 'visible'
    },
    title: {
        display: 'block',
        color: 'rgb(0, 0, 0) !important',
        maxHeight: '36px',
        lineHeight: '18px',
        fontSize: '14px',
        letterSpacing: 'unset',
        // width: '100%',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    subTitle: {
        display: 'block',
        color: 'rgba(0, 0, 0, 0.7) !important',
        lineHeight: '14px',
        fontSize: '12px',
        marginTop: '2px',
        letterSpacing: 'unset',
        width: '100%'
    },
    link: {
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    menuButton: {
        position: 'absolute',
        top: 4,
        right: 5,
        width: '32px',
        height: '32px',
        padding: '4px',
        color: 'white',
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out'
    },
    playButton: {
        position: 'absolute',
        bottom: 9,
        right: 10,
        width: '24px',
        height: '24px',
        padding: '4px',
        color: 'black',
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out',
        // seems this background color messes up the hover on the button without the !important
        backgroundColor: 'white !important'
    },
    icon: {
        width: 24,
        height: 24
    }
})

export default function CompactItemGridRenderer({
    primary,
    secondary,
    art,
    onClick,
    onClickPlay,
    onClickPrimary,
    onClickSecondary,
    onClickMenu
}: ItemGridRendererProps) {
    const classes = useStyles()

    const handleClickPrimary = (event: MouseEvent<HTMLParagraphElement>) => {
        if (onClickPrimary) {
            event.stopPropagation()
            onClickPrimary()
        }
    }

    const handleClickSecondary = (event: MouseEvent<HTMLParagraphElement>) => {
        if (onClickSecondary) {
            event.stopPropagation()
            onClickSecondary()
        }
    }

    const handleClickPlay = (evt: MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        onClickPlay()
    }

    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onClickMenu && onClickMenu(event.currentTarget)
    }

    return (
        <div className={classes.root} onClick={onClick}>
            <div className={classes.cover}>
                {art}
                {onClickMenu && (
                    <IconButton className={classes.menuButton} onClick={handleClickMenu} size='large'>
                        <MdMoreVert className={classes.icon} />
                    </IconButton>
                )}
                <IconButton className={classes.playButton} onClick={handleClickPlay} size='large'>
                    <MdPlayArrow className={classes.icon} />
                </IconButton>
            </div>
            <div className={classes.detail}>
                <Typography
                    className={clsx(classes.title, classes.link)}
                    variant='body2'
                    component='p'
                    onClick={handleClickPrimary}
                >
                    {primary}
                </Typography>
                <Typography
                    className={clsx(classes.subTitle, { [classes.link]: onClickSecondary })}
                    variant='body2'
                    component='p'
                    onClick={handleClickSecondary}
                >
                    {secondary}
                </Typography>
            </div>
        </div>
    )
}
