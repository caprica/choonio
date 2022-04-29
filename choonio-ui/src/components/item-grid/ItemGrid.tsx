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
import { Typography } from '@mui/material'

/**
 * Specification for a column breakpoint.
 *
 * The item grid component uses these column breakpoints to automatically choose a particular number of columns
 * depending on the current viewport width.
 */
export interface ColumnBreakpoint {
    /**
     * Minimum width at which this breakpoint is effective.
     */
    readonly width: number
    /**
     * Number of columns to use when this breakpoint is effective.
     */
    readonly count: number
}

/**
 * Properties for the component.
 *
 * @param T type of item in the item grid data model
 */
interface ItemGridProps<T> {
    columns: number
    columnWidth: number
    items: Array<T>
    renderItem: (item: T) => React.ReactNode
    emptyCaption?: string
}

/**
 * Custom styles for the component.
 */
const useStyles = makeStyles({
    root: {
        display: 'grid'
    }
})

/**
 * A component used to display a grid of items.
 *
 * The grid adapts the number of columns according to the current viewport width (using media queries) and the supplied
 * column breakpoints.
 *
 * @param T type of item in the item grid data model
 * @param param0 destructured component properties
 */
export default function ItemGrid<T>({ columns, columnWidth, items, renderItem, emptyCaption }: ItemGridProps<T>) {
    const classes = useStyles()

    const gridStyle = {
        gridTemplateColumns: `repeat(${columns}, ${columnWidth}px)`
    }

    if (items.length > 0) {
        return (
            <div className={classes.root} style={gridStyle}>
                {items.map(item => renderItem(item))}
            </div>
        )
    }

    if (emptyCaption) {
        return (
            <Typography variant='body2' color='textSecondary'>
                {emptyCaption}
            </Typography>
        )
    }

    return null
}
