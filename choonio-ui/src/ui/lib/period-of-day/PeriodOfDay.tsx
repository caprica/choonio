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

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import SectionHeading from '../../../components/section-heading/SectionHeading'
import { periodOfDay } from '../../../lib/period-of-day/period-of-day'

const REFRESH_INTERVAL_MS = 30000

interface PeriodOfDayProps {
    className?: string
}

const dayOfWeek = () => dayjs().format('dddd')

export default function PeriodOfDay({ className }: PeriodOfDayProps) {
    const [day, setDay] = useState(dayOfWeek())
    const [period, setPeriod] = useState(periodOfDay())

    useEffect(() => {
        const interval = setInterval(() => {
            setDay(dayOfWeek())
            setPeriod(periodOfDay())
        }, REFRESH_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [])

    return <SectionHeading className={className} title={`${day} ${period}`} />
}
