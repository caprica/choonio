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
import { DISPLAY_DATE_FORMAT } from '../../../../lib/date-format/date-format'
import { DateRange } from '../../../../lib/date-ranges/date-ranges'

const useStyles = makeStyles({
    root: {
        textAlign: 'end'
    }
})

interface RangeFooterProps {
    dateRange?: DateRange
}

const getMessage = (dateRange?: DateRange) => {
    if (dateRange) {
        const from = dateRange.fromInclusive
        const to = dateRange.toExclusive.subtract(1, 'day')
        if (!from.isSame(to)) {
            return `from ${from.format(DISPLAY_DATE_FORMAT)} to ${to.format(DISPLAY_DATE_FORMAT)} inclusive`
        } else {
            return `on ${from.format(DISPLAY_DATE_FORMAT)}`
        }
    } else {
        return 'all time'
    }
}

export default function RangeFooter({ dateRange }: RangeFooterProps) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Typography variant='caption' color='textSecondary'>
                {getMessage(dateRange)}
            </Typography>
        </div>
    )
}
