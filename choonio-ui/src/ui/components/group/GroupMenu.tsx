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

import { useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { GroupOption } from './group-options'

const useStyles = makeStyles(theme => ({
    menu: {
        padding: theme.spacing(2, 0)
    }
}))

// We use <T extends string | number> since we use string-based and number-based enums, there is no base Enum type to constrain by
interface GroupMenuProps<T extends string | number> {
    anchorEl: null | HTMLElement
    options: Array<GroupOption<T>>
    currentValue: T
    onClose: () => void
    onSelected: (selected: T) => void
}

export default function GroupMenu<T extends string | number>({
    anchorEl,
    options,
    currentValue,
    onClose,
    onSelected
}: GroupMenuProps<T>) {
    const classes = useStyles()

    const [selected, setSelected] = useState<null | T>(null)

    // Defer notifying the selection until the menu has closed, otherwise the menu closing animation is unlikely to complete
    const handleSelect = (selectedValue: T) => () => {
        onClose()
        setSelected(selectedValue)
    }

    const handleExit = () => selected && onSelected(selected)

    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={onClose}
            TransitionProps={{ onExited: handleExit }}
            classes={{ list: classes.menu }}
        >
            {options.map(option => (
                <MenuItem key={option.value} selected={currentValue === option.value} onClick={handleSelect(option.value)}>
                    {option.caption || option.value}
                </MenuItem>
            ))}
        </Menu>
    )
}
