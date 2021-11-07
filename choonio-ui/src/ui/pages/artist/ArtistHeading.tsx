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

import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles({
    header: {
        height: '36px',
        boxSizing: 'border-box',
        margin: '0 8px 4px 8px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
    },
    headerInner: {
        flex: 1,
        marginLeft: '16px',
        height: '100%'
    },
    headerCaption: {
        outline: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '18px',
        // fontWeight: 500,
        fontWeight: 'bold',
        lineHeight: '24px',
        color: '#212121',
        cursor: 'default',
        margin: 0
    }
})

interface HeadingProps {
    className?: string
    caption: string
}

export default function Heading({ className, caption }: HeadingProps) {
    const classes = useStyles()

    return (
        <div className={clsx(className, classes.header)}>
            <div className={classes.headerInner}>
                <h2 className={classes.headerCaption}>{caption}</h2>
            </div>
        </div>
    )
}
