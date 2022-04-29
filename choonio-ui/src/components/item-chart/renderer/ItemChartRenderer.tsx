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

import { Typography } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles({
    rank: {
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.54)',
        width: '3ch',
        marginRight: 12
    },
    caption: {
        color: '#212121',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

export interface ItemChartRendererProps<T> {
    item: T
    rank: number
    primary: string
    art: JSX.Element
    meta: JSX.Element
    onClickPrimary: (item: T) => void
}

export default function ItemChartRenderer<T>({ item, rank, primary, art, meta, onClickPrimary }: ItemChartRendererProps<T>) {
    const classes = useStyles()

    const handleClickPrimary = (item: T) => () => onClickPrimary(item)

    return (
        <>
            <Typography className={classes.rank} variant='h4'>
                {String(rank).padStart(2, '0')}
            </Typography>
            {art}
            <div>
                <Typography className={classes.caption} variant='h5' onClick={handleClickPrimary(item)}>
                    {primary}
                </Typography>
                {meta}
            </div>
        </>
    )
}
