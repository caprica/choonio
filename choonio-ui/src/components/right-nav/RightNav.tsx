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
import { MdHome } from 'react-icons/md'
import { useNavigation } from '../../hooks/navigation/useNavigation'
import RightNavItem from './RightNavItem'

// The right-nav is not used for now

const useStyles = makeStyles({
    root: {
        display: 'none',
        // display: 'flex',
        flexDirection: 'column',
        color: '#616161'
    }
})

export default function RightNav() {
    const classes = useStyles()

    const { gotoHome } = useNavigation()

    return (
        <div className={classes.root}>
            <RightNavItem icon={<MdHome />} label='Feeling Lucky' onClick={gotoHome} />
        </div>
    )
}
