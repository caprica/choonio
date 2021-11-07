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

import { Typography } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles({
    caption: {
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '24px',
        color: '#212121'
    },
    link: {
        fontSize: '18px',
        // lineHeight: '24px',
        color: 'unset',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

interface TopStatsCrumbProps {
    caption: string
    active: boolean
    onClick: () => void
}

export default function TopStatsCrumb({ caption, active, onClick }: TopStatsCrumbProps) {
    const classes = useStyles()

    if (active) {
        return <Typography className={classes.caption}>{caption}</Typography>
    } else {
        return (
            <span className={classes.link} onClick={onClick}>
                {caption}
            </span>
        )
    }
}
