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

import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles({
    root: {
        lineHeight: '20px',
        letterSpacing: 'unset',
        marginBottom: 4,
        color: 'rgba(0, 0, 0, 0.54)'
    }
})

interface DescriptionProps {
    description: string
}

export default function Description({ description }: DescriptionProps) {
    const classes = useStyles()

    return (
        <Typography className={classes.root} variant='body2'>
            {description}
        </Typography>
    )
}
