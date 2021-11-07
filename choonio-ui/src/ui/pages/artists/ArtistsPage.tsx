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
import { useGetArtists } from '../../../api/endpoints/artists-controller'
import Artists from './Artists'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 8)
    }
}))

export default function ArtistsPage() {
    const classes = useStyles()

    const { data } = useGetArtists()

    if (!data) return null

    return (
        <section className={classes.root}>
            {data && (
                <div>
                    <Artists artists={data} />
                </div>
            )}
        </section>
    )
}
