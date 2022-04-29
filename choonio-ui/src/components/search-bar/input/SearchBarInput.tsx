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

import { useState } from 'react'
import clsx from 'clsx'

import { Paper } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import InputBase from '@mui/material/InputBase'

import { MdSearch as SearchIcon } from 'react-icons/md'
import { MdClear as ClearIcon } from 'react-icons/md'

// can't get the height to 48 properly
const useStyles = makeStyles(theme => ({
    root: {
        // for clear icon
        display: 'inline-block'
    },
    inputRoot: {
        outline: 'none',
        display: 'inline-block',
        backgroundColor: '#f5f5f5'
    },
    inputInput: {
        borderRadius: '2px',
        outline: 'none',
        //        padding: theme.spacing(1, 1, 1, 0),
        padding: '10px 12px',
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(2em + ${theme.spacing(4)})`,
        // transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '70ch'
        }
        //maxWidth: 800,
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        fontSize: '24px',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1 // why?
    },
    clearIcon: {
        padding: theme.spacing(0, 2, 0, 0),
        fontSize: '24px',
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        cursor: 'pointer'
    },
    active: {
        backgroundColor: 'white'
    }
}))

export default function SearchBarInput(params: any) {
    const classes = useStyles()

    const [focus, setFocus] = useState(false)

    const handleFocusInput = (_evt: any) => {
        setFocus(true)
    }

    const handleBlurInput = (_evt: any) => {
        setFocus(false)
    }

    const handleClickClear = (_evt: any) => {
        console.log('Clear')
    }

    // {clsx(classes.root, {[classes.active]: focus})}

    return (
        <Paper className={classes.root} square elevation={focus ? 6 : 0}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                onFocus={handleFocusInput}
                onBlur={handleBlurInput}
                style={{ width: '38em' }} // without the width, the popper won't appear correctly, it will be slightly too wide and slightly misaligned - the 100% width is somehow wrong
                ref={params.InputProps.ref}
                placeholder='Search'
                classes={{ root: clsx(classes.inputRoot, { [classes.active]: focus }), input: classes.inputInput }}
                inputProps={{ ...params.inputProps }}
            />
            {/* can use position absolute, right 0, but also need to adjust the editor margin or padding */}
            <div className={classes.clearIcon} onClick={handleClickClear}>
                <ClearIcon />
            </div>
        </Paper>
    )
}
