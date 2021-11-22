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

import dayjs from 'dayjs'
import { useVisualisationOptions } from '../../hooks/options/visualisation-options-context'
import DateTool from '../tools/date-tool/DateTool'
import IntegerTool from '../tools/input-tool/IntegerTool'
import SelectTool from '../tools/select-tool/SelectTool'
import ToolPalette from './ToolPalette'
import { dateRangeOptions } from './options/date-range-options'
import { dateRangeForPeriod } from '../../../../../lib/date-ranges/date-ranges'
import { useVisualisationData } from '../../hooks/data/visualisation-data-context'

const DATE_FORMAT = 'YYYY-MM-DD'
const CUSTOM_PERIOD = 'custom'

export default function ImageToolPalette() {
    const { options, setOptions } = useVisualisationOptions()

    const { meta } = useVisualisationData()

    const handlePeriodChange = (period: string) => {
        if (period !== CUSTOM_PERIOD) {
            const dateRange = dateRangeForPeriod(period)
            if (dateRange) {
                const from = dateRange.fromInclusive.format(DATE_FORMAT)
                const to = dateRange.toExclusive.format(DATE_FORMAT)
                setOptions({ ...options, from, to, period })
            } else {
                const from = meta ? dayjs(meta.from).format(DATE_FORMAT) : ''
                const to = meta ? dayjs(meta.to).format(DATE_FORMAT) : ''
                setOptions({ ...options, from, to, period: '' })
            }
        }
    }

    const handleFromDateChange = (from: string) => setOptions({ ...options, from, period: CUSTOM_PERIOD })
    const handleToDateChange = (to: string) => setOptions({ ...options, to, period: CUSTOM_PERIOD })
    const handleTopRanksChange = (top: number) => setOptions({ ...options, top })
    const handleMinimumListensChange = (minimumCount: number) => setOptions({ ...options, minimumCount })

    return (
        <ToolPalette caption='Data Filters'>
            <SelectTool caption='Period' options={dateRangeOptions} value={options.period} onChange={handlePeriodChange} />
            <DateTool caption='From date' value={options.from} onChange={handleFromDateChange} />
            <DateTool caption='To date' value={options.to} onChange={handleToDateChange} />
            <IntegerTool caption='Top ranks' min={1} value={options.top} onChange={handleTopRanksChange} />
            <IntegerTool caption='Minimum listens' min={0} value={options.minimumCount} onChange={handleMinimumListensChange} />
        </ToolPalette>
    )
}
