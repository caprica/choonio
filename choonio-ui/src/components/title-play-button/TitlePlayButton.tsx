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

import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'

import PlayButton from './PlayButton'

interface TitlePlayButtonProps {
    title: string
    onClickPlay: () => void
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        columnGap: theme.spacing(2),
        alignItems: 'center',
        fontSize: '34px',
        '& *': {
            letterSpacing: 'unset'
        }
        // '& svg:hover': {
        //     color: 'orangered',
        // }
    },
    title: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    button: {
        flex: 'none',
        fontSize: '48px'
    }
}))

export default function TitlePlayButton({ title, onClickPlay }: TitlePlayButtonProps) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant='h4'>
                {title}
            </Typography>{' '}
            <PlayButton className={classes.button} onClick={onClickPlay} />
        </div>
    )
}
