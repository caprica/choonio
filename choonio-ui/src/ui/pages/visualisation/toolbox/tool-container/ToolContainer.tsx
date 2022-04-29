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

import clsx from 'clsx'
import makeStyles from '@mui/styles/makeStyles'
import { ElementType, useState } from 'react'
import ToolCaption from './ToolCaption'
import ToolEditor from './ToolEditor'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        borderBottom: '1px solid rgb(74,85,104)',
        minHeight: '28px'
    },
    caption: {
        flex: '0 0 120px',
        borderRight: '10px solid rgb(74,85,104)'
    },
    editor: {
        flexGrow: 1,
        padding: '4px 8px',
        '&:hover': {
            backgroundColor: 'rgb(45,55,72)'
        }
    },
    active: {
        backgroundColor: 'rgb(45,55,72)'
    }
})

interface ToolContainerProps<T> {
    className?: string
    caption?: string
    editor: ElementType
    value: T
    onChange: (newValue: T) => boolean
    [k: string]: any
}

export default function ToolContainer<T>({ className, caption, editor, value, onChange, ...rest }: ToolContainerProps<T>) {
    const classes = useStyles()

    const [active, setActive] = useState(false)

    const handleBeginEditing = () => setActive(true)
    const handleEndEditing = () => setActive(false)

    return (
        <div className={clsx(className, classes.root)}>
            <ToolCaption className={classes.caption} caption={caption} />
            <ToolEditor<T>
                className={clsx(classes.editor, { [classes.active]: active })}
                editor={editor}
                value={value}
                onBeginEditing={handleBeginEditing}
                onEndEditing={handleEndEditing}
                onChange={onChange}
                {...rest}
            />
        </div>
    )
}
