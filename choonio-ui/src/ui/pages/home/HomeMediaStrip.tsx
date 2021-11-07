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

import NavigationHeading from './NavigationHeading'
import makeStyles from '@mui/styles/makeStyles'

import ItemGrid from '../../../components/item-grid/ItemGrid'

const useStyles = makeStyles({
    root: {
        paddingBottom: 40
    }
})

interface HomeMediaStripProps<T> {
    caption: string
    items: Array<T>
    itemRenderer: (item: T) => React.ReactNode
    onClickCaption: () => void
    emptyCaption: string
}

export default function HomeMediaStrip<T>({
    caption,
    items,
    itemRenderer,
    onClickCaption,
    emptyCaption
}: HomeMediaStripProps<T>) {
    const classes = useStyles()

    if (!items) return null

    return (
        <div className={classes.root}>
            <NavigationHeading caption={caption} onClick={onClickCaption} />
            <ItemGrid columns={10} items={items} columnWidth={98} renderItem={itemRenderer} emptyCaption={emptyCaption} />
        </div>
    )
}
