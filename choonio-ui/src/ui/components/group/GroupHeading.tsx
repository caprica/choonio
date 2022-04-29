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
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
    root: {
        outline: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '18px',
        fontWeight: 500,
        height: '36px',
        lineHeight: '24px',
        color: '#212121',
        cursor: 'default',
        margin: theme.spacing(6, 1, 0.5, 1)
    }
}))

interface GroupHeadingProps {
    caption: string
    className?: string
}

export default function GroupHeading({ caption, className }: GroupHeadingProps) {
    const classes = useStyles()

    return <h2 className={clsx(className, classes.root)}>{caption}</h2>
}
