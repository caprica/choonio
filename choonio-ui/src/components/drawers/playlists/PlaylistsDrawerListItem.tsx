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
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'

import PlaylistsDrawerListItemText from './PlaylistsDrawerListItemText'

const useStyles = makeStyles({
    listItem: {
        fontSize: '14px',
        fontWeight: 'bold',
        height: '48px'
        // color: '#212121'
    },
    icon: {
        fontSize: '24px',
        color: '#616161'
    }
})

interface PlaylistDrawerListItemProps {
    text: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
}

export default function PlaylistsDrawerListItem({ text, icon: Icon, onClick }: PlaylistDrawerListItemProps) {
    const classes = useStyles()

    return (
        <ListItem button classes={{ root: classes.listItem }} onClick={onClick}>
            <ListItemIcon>
                <Icon className={classes.icon} />
            </ListItemIcon>
            <PlaylistsDrawerListItemText primary={text} />
        </ListItem>
    )
}
