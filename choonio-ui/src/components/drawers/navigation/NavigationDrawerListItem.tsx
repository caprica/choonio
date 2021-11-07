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
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'

import NavigationDrawerListItemText from './NavigationDrawerListItemText'

const useStyles = makeStyles({
    listItem: {
        fontSize: '14px',
        fontWeight: 'bold',
        height: '48px'
    },
    icon: {
        fontSize: '24px',
        color: '#616161'
    }
})

interface NavigationDrawerListItemProps {
    text: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
}

export default function NavigationDrawerListItem({ text, icon: Icon, onClick }: NavigationDrawerListItemProps) {
    const classes = useStyles()

    return (
        <ListItem button classes={{ root: classes.listItem }} onClick={onClick}>
            <ListItemIcon>
                <Icon className={classes.icon} />
            </ListItemIcon>
            <NavigationDrawerListItemText primary={text} />
        </ListItem>
    )
}
