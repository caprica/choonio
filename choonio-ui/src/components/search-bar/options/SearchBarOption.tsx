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
import { MouseEvent } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MdPlayCircleOutline as PlayIcon } from 'react-icons/md'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: 0
    },
    cover: {
        flexGrow: 0,
        marginRight: theme.spacing(3),
        '& img': {
            width: 32,
            height: 32,
            verticalAlign: 'middle'
        }
    },
    rounded: {
        '& img': {
            borderRadius: '50%'
        }
    },
    text: {
        flexGrow: 1
    },
    play: {
        flexGrow: 0,
        marginRight: theme.spacing(0.5)
    },
    playIcon: {
        fontSize: '40px'
    }
}))

// This is not too bad, but i may be better off with a bespoke control using react-popper

interface SearchBarOptionProps {
    cover: JSX.Element
    rounded?: boolean
    primary: string
    secondary: string
    onClickPlay: () => void
}

export default function SearchBarOption({ cover, rounded, primary, secondary, onClickPlay }: SearchBarOptionProps) {
    const classes = useStyles()

    // This will fire the click event, and because the event propagation is NOT prevented, it will also close the popup
    // which will effect a selection - this will then not just play the selection but to go the relevant page as well
    const handleClickPlay = (_event: MouseEvent<HTMLElement>) => onClickPlay()

    return (
        <Box className={classes.root}>
            <div className={clsx(classes.cover, { [classes.rounded]: rounded })}>{cover}</div>
            <div className={classes.text}>
                <Typography variant='body2' color='textPrimary'>
                    {primary}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                    {secondary}
                </Typography>
            </div>
            <div className={classes.play}>
                <IconButton edge='end' onClick={handleClickPlay}>
                    <PlayIcon className={classes.playIcon} />
                </IconButton>
            </div>
        </Box>
    )
}
