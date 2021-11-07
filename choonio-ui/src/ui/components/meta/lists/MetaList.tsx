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
import { uniq } from 'lodash'

const useStyles = makeStyles({
    item: {
        '&:not(:last-child):after': {
            content: '" • "'
        }
    },
    link: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

interface MetaListProps {
    items: Array<string>
    onClickItem?: (item: string) => void
}

export default function MetaList({ items, onClickItem }: MetaListProps) {
    const classes = useStyles()

    const uniqueItems = uniq(items)

    return (
        <>
            {uniqueItems.map(item => (
                <span key={item} className={classes.item}>
                    {onClickItem ? (
                        <span className={classes.link} onClick={() => onClickItem(item)}>
                            {item}
                        </span>
                    ) : (
                        <span>{item}</span>
                    )}
                </span>
            ))}
        </>
    )
}

/*
    return (
        <ul className={classes.root}>
            {uniqueItems.map(item => (
                <li key={item} className={classes.item}>
                    {onClickItem ? (
                        <span className={classes.link} onClick={() => onClickItem(item)}>
                            {item}
                        </span>
                    ) : (
                        <span>{item}</span>
                    )}
                </li>
            ))}
        </ul>
    )
*/
