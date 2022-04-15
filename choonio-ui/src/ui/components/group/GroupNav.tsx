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

import { useParams } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MouseEvent, useState } from 'react'
import { GroupOption } from './group-options'
import GroupMenu from '../../components/group/GroupMenu'
import invariant from 'tiny-invariant'

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(0, 1, 0.5, 1)
    },
    breadcrumbs: {
        cursor: 'default',
        marginBottom: theme.spacing(2)
    },
    caption: {
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '24px',
        color: '#212121'
    },
    link: {
        fontSize: '18px',
        color: 'unset',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    selector: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}))

interface GroupNavProps<T extends string | number> {
    caption: string
    options: Array<GroupOption<T>>
    onSelected: (group: T) => void
}

export default function GroupNav<T extends string | number>({ caption, options, onSelected }: GroupNavProps<T>) {
    const classes = useStyles()

    const { grouping } = useParams()
    invariant(grouping)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleClick = (event: MouseEvent<HTMLSpanElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const selected = options.find(option => option.value === (grouping as T))

    return (
        <div className={classes.root}>
            <Breadcrumbs className={classes.breadcrumbs} aria-label='breadcrumb'>
                <Typography className={classes.caption}>
                    <span>{caption}</span>
                </Typography>
                <Typography className={classes.caption}>
                    <span className={classes.selector} onClick={handleClick}>
                        {selected && (selected.caption || selected.value)}
                    </span>
                </Typography>
            </Breadcrumbs>
            <GroupMenu<T>
                anchorEl={anchorEl}
                options={options}
                currentValue={grouping as T}
                onSelected={onSelected}
                onClose={handleClose}
            />
        </div>
    )
}
