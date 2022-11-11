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
import { MdFavorite, MdHistory, MdHome, MdLibraryMusic, MdPlaylistAdd, MdStar, MdViewList } from 'react-icons/md'
import { useRandomQueue } from '../../api/endpoints/queue-controller'
import { useNavigation } from '../../hooks/navigation/useNavigation'
import DiceIcon from '../dice-icon/DiceIcon'
import QuickNavItem from './QuickNavItem'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        color: '#616161'
    }
})

export default function QuickNav() {
    const classes = useStyles()

    const { gotoHome, gotoLibrary, gotoPlaylists, gotoRecent, gotoFavourites, gotoStatistics, gotoPlaylistGenerator } =
        useNavigation()

    const randomQueue = useRandomQueue()

    const handleRandom = () => randomQueue()

    return (
        <div className={classes.root}>
            <QuickNavItem icon={<MdHome />} label='Home' onClick={gotoHome} />
            <QuickNavItem icon={<MdLibraryMusic />} label='Music library' onClick={gotoLibrary} />
            <QuickNavItem icon={<MdHistory />} label='Recent' onClick={gotoRecent} />
            <QuickNavItem icon={<MdFavorite />} label='Favourites' onClick={gotoFavourites} />
            <QuickNavItem icon={<MdViewList />} label='Playlists' onClick={gotoPlaylists} />
            <QuickNavItem icon={<MdStar />} label='Top charts' onClick={gotoStatistics} />
            <QuickNavItem icon={<DiceIcon />} label='Feeling lucky' onClick={handleRandom} />
            <QuickNavItem icon={<MdPlaylistAdd />} label='Ad-hoc playlist' onClick={gotoPlaylistGenerator} />
        </div>
    )
}
