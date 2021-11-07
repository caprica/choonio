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
import { MdChevronRight } from 'react-icons/md'

// can styles be replaced with a Tyopgraphy?

const useStyles = makeStyles({
    header: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingBottom: 19,
        marginTop: -1
    },
    headerInner: {
        flex: 1,
        // marginLeft: '16px',
        height: '100%'
    },
    headerCaption: {
        outline: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '15px',
        fontWeight: 500,
        // fontWeight: 'bold',
        // lineHeight: '24px',
        color: '#212121',
        cursor: 'default',
        margin: 0,
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    icon: {
        fontSize: '20px'
    }
})

interface HeadingProps {
    className?: string
    onClick: () => void
    caption: string
}

export default function NavigationHeading({ className, onClick, caption }: HeadingProps) {
    const classes = useStyles()

    return (
        <span className={clsx(className, classes.header)}>
            <h2 className={classes.headerCaption} onClick={onClick}>
                {caption}
            </h2>
            <MdChevronRight className={classes.icon} />
        </span>
    )
}
