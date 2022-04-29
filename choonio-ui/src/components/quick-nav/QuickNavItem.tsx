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

import { MouseEvent } from 'react'

import { ButtonBase } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

// padding bottom between items 8px
// the active page has a orangered colour
// browse stations would wrap to two lines

/**
 * Custom styles for the component.
 */
const useStyles = makeStyles({
    root: {
        overflow: 'hidden',
        width: '72px',
        height: '72px',
        borderRadius: '50%'
    },
    iconButton: {
        // cursor: 'pointer',
        fontSize: '24px',
        width: '100%',
        height: '100%'
    },
    button: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#4b4b4b'
    },
    label: {
        marginTop: 4,
        fontSize: '10px'
    }
})

/**
 * Properties for the component.
 */
interface QuickNavItemProps {
    icon: JSX.Element
    label: string
    onClick: () => void
}

/**
 * A component used to display and select an item on a QuickNav toolbar.
 *
 * @param param0 destructured component properties
 */
export default function QuickNavItem({ icon, label, onClick }: QuickNavItemProps) {
    const classes = useStyles()

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        onClick()
    }

    return (
        <div className={classes.root} onClick={handleClick}>
            <ButtonBase className={classes.iconButton}>
                <div className={classes.button}>
                    {icon}
                    {/* <Typography className={classes.label} variant="body2" align="center">Home</Typography> */}
                    <span className={classes.label}>{label}</span>
                </div>
            </ButtonBase>
        </div>
    )
}
