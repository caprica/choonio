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

import { useState, MouseEvent } from 'react'
import clsx from 'clsx'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { IconButton } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

import { MdMoreVert } from 'react-icons/md'
import { BsPlayFill as PlayIcon } from 'react-icons/bs'
import Highlighter from 'react-highlight-words'

const useStyles = makeStyles({
    root: {
        minWidth: 160,
        overflow: 'visible',
        whitespace: 'nowrap',
        display: 'inline-block',
        position: 'relative',
        backgroundcolor: 'white',
        margin: 8,
        borderRadius: 2,
        fontWeight: 300,
        verticalAlign: 'top',
        userSelect: 'none',
        cursor: 'pointer',
        '&:hover': {
            // boxShadow: '0 6px 6px 0 rgba(0,0,0,0.27)',
            // boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4)',
            boxShadow:
                '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4)',
            transition: 'box-shadow 0.28s cubic-bezier(0.4,0,0.2,1)'
        },
        '&:hover button': {
            opacity: 1
        },
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)'
    },
    media: {
        // width: '100%',
        cursor: 'pointer',
        verticalAalign: 'top',
        borderRadius: '2px 2px 0 0',
        // height: 'auto',
        '& img': {
            width: '100%',
            cursor: 'pointer',
            verticalAalign: 'top',
            borderRadius: '2px 2px 0 0',
            height: 'auto'
        }
    },
    title: {
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize: '15px',
        lineHeight: '18px',
        fontWeight: 400,
        color: '#212121',
        textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        position: 'relative',
        '&:hover': {
            textDecoration: 'underline'
        },
        '&:after': {
            display: 'block',
            position: 'absolute',
            right: 0,
            bottom: 0,
            top: 0,
            width: 30,
            content: "''",
            background: 'linear-gradient(to right,rgba(255,255,255,0),rgba(255,255,255,1))'
        },
        margin: 0
    },
    subTitle: {
        display: 'block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize: '13px',
        lineHeight: '16px',
        height: 16,
        fontWeight: 400,
        color: '#616161',
        marginTop: 4,
        textDecoration: 'none',
        outline: 'none',
        '&:after': {
            display: 'block',
            position: 'absolute',
            right: 0,
            bottom: 0,
            top: 0,
            width: 30,
            content: "''",
            background: 'linear-gradient(to right,rgba(255,255,255,0),rgba(255,255,255,1))'
        }
    },
    link: {
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    content: {
        marginTop: '-4px',
        paddingBottom: '16px !important',
        position: 'relative'
    },
    contentInner: {
        position: 'relative'
    },
    playButtonContainer: {
        transition: 'opacity 0.3s ease-in-out',
        position: 'absolute',
        height: '40px',
        width: '40px',
        right: '4px',
        bottom: '72px',
        borderRadius: '50%',
        opacity: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    playButton: {
        padding: '6px',
        fontSize: '30px',
        color: 'white',
        display: 'inline-block',
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
    },
    menuContainer: {
        fontSize: '13px',
        padding: 0
    },
    menuButton: {
        position: 'absolute',
        top: '8px',
        right: '0',
        width: '26px',
        height: '26px',
        padding: '4px',
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out',
        cursor: 'pointer',
        color: '#212121'
    },
    menu: {
        padding: '16px 0'
    }
})

export interface ItemGridRendererProps {
    primary: string
    secondary: string
    highlight?: string
    art: JSX.Element
    onClick: () => void
    onClickPlay: () => void
    onClickPrimary?: () => void
    onClickSecondary?: () => void
    onClickMenu?: (anchorEl: HTMLElement) => void
}

export default function ItemGridRenderer({
    primary,
    secondary,
    highlight,
    art,
    onClick,
    onClickPlay,
    onClickPrimary,
    onClickSecondary,
    onClickMenu
}: ItemGridRendererProps) {
    const classes = useStyles()

    const [active, setActive] = useState(false)

    const handleEnter = () => setActive(true)
    const handleExit = () => setActive(false)

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

    const handlePlayClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onClickPlay()
    }

    const handleClickMenu = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        onClickMenu && onClickMenu(event.currentTarget)
    }

    const secondaryLink = Boolean(onClickSecondary)

    return (
        <Card className={classes.root} elevation={2} onClick={onClick} onMouseEnter={handleEnter} onMouseLeave={handleExit}>
            <div className={classes.media}>{art}</div>
            <div className={clsx({ [classes.active]: active }, classes.playButtonContainer)} onClick={handlePlayClick}>
                <span className={classes.playButton}>
                    <PlayIcon />
                </span>
            </div>
            <CardContent className={classes.content}>
                <div className={classes.contentInner}>
                    <Typography
                        // className={clsx(classes.title, { [classes.showLink]: active })}
                        className={clsx(classes.title, classes.link)}
                        variant='body2'
                        component='p'
                        onClick={handleClickPrimary}
                    >
                        {highlight ? (
                            <Highlighter searchWords={[highlight]} autoEscape={true} textToHighlight={primary} />
                        ) : (
                            primary
                        )}
                    </Typography>
                    <Typography
                        className={clsx(classes.subTitle, { [classes.link]: secondaryLink })}
                        variant='body2'
                        component='p'
                        onClick={handleClickSecondary}
                    >
                        {highlight ? (
                            <Highlighter searchWords={[highlight]} autoEscape={true} textToHighlight={secondary} />
                        ) : (
                            secondary
                        )}
                    </Typography>
                </div>
                <div className={classes.menuContainer}>
                    <IconButton className={classes.menuButton} onClick={handleClickMenu} size='large'>
                        <MdMoreVert />
                    </IconButton>
                </div>
            </CardContent>
        </Card>
    )
}
