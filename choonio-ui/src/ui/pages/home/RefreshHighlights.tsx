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

import { IconButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MdRefresh } from 'react-icons/md'
import { useRefreshHighlights } from '../../../api/endpoints/highlights-controller'

const useStyles = makeStyles({
    root: {
        alignSelf: 'start',
        marginTop: '-4px'
    }
})

export default function RefreshHighlights() {
    const classes = useStyles()

    const refreshHighlights = useRefreshHighlights()

    const handleClickRefreshHighlights = () => refreshHighlights()

    return (
        <IconButton className={classes.root} onClick={handleClickRefreshHighlights} size='large'>
            <MdRefresh />
        </IconButton>
    )
}
