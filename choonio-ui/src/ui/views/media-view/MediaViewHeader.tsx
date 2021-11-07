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
import makeStyles from '@mui/styles/makeStyles'
import Artists from '../../components/artists/Artists'
import Description from './Description'
import CoverDialog from '../../../components/covers/CoverDialog'
import TitlePlayButton from '../../../components/title-play-button/TitlePlayButton'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        columnGap: theme.spacing(4),
        marginBottom: 40
    },
    art: {
        width: 180,
        height: 180,
        '& img': {
            width: '100%',
            height: '100%'
        }
    },
    round: {
        '& img': {
            borderRadius: '50%'
        }
    },
    text: {
        overflow: 'hidden'
    }
}))

interface MediaViewHeaderProps {
    title: string
    description?: string
    artists?: string[]
    round?: boolean
    cover: JSX.Element
    dialogCover?: JSX.Element
    meta?: JSX.Element
    actions?: JSX.Element
    onClickPlay: () => void
}

/**
 * The standard header for a media view.
 *
 * The header section contains cover art and a cover art popup, along with a title and various optional textual metadata
 * components.
 *
 * @param component properties
 * @returns component
 */
export default function MediaViewHeader({
    title,
    description,
    artists,
    round,
    cover,
    dialogCover,
    meta,
    actions,
    onClickPlay
}: MediaViewHeaderProps) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={clsx(classes.art, { [classes.round]: round })}>
                {dialogCover ? <CoverDialog cover={cover} dialogCover={dialogCover} /> : cover}
            </div>
            <div className={classes.text}>
                <TitlePlayButton title={title} onClickPlay={onClickPlay} />
                {description && <Description description={description} />}
                {artists && <Artists artists={artists} />}
                {meta}
                {actions}
            </div>
        </div>
    )
}
