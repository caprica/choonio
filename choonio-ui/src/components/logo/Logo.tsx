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

// import logo from '../../logo.svg'

const useStyles = makeStyles({
    root: {
        display: 'inline-block',
        height: '48px',
        width: '170px',
        marginLeft: '2px'
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/logo.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
    }
})

export default function Logo() {
    const classes = useStyles()

    return (
        <a className={classes.root} href='#'>
            <div className={classes.image} />
        </a>
    )
}
