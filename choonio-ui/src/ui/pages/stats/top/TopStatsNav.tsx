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
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import { MouseEvent, useState } from 'react'
import { captionForTopPeriod, TopPeriod, TopWhat, useTopStatsSettings } from '../../../../hooks/settings/useTopStatsSettings'
import GroupMenu from '../../../components/group/GroupMenu'
import TopStatsCrumb from './TopStatsCrumb'
import invariant from 'tiny-invariant'

const topHowManyOptions = [{ value: 10 }, { value: 20 }, { value: 50 }, { value: 100 }]

const topPeriodOptions = [
    { value: TopPeriod.AllTime, caption: 'all-time' },
    { value: TopPeriod.Today, caption: 'today' },
    { value: TopPeriod.Yesterday, caption: 'yesterday' },
    { value: TopPeriod.LastSevenDays, caption: 'last seven days' },
    { value: TopPeriod.ThisWeek, caption: 'this week' },
    { value: TopPeriod.LastWeek, caption: 'last week' },
    { value: TopPeriod.ThisMonth, caption: 'this month' },
    { value: TopPeriod.ThisYear, caption: 'this year' }
]

const useStyles = makeStyles(theme => ({
    root: {},
    breadcrumbs: {
        cursor: 'default',
        marginBottom: theme.spacing(3)
    },
    caption: {
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '24px',
        color: '#212121'
    },
    selector: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}))

type ParamsType = {
    top: string
    period: TopPeriod
    what: TopWhat
}

export default function TopStatsNav() {
    const classes = useStyles()

    const { top, period, what } = useParams<ParamsType>()
    invariant(top)
    invariant(period)
    invariant(what)

    const { setTopHowMany, setTopWhat, setTopPeriod } = useTopStatsSettings()

    const [topHowManyAnchorEl, setTopHowManyAnchorEl] = useState<null | HTMLElement>(null)
    const [TopPeriodAnchorEl, setTopPeriodAnchorEl] = useState<null | HTMLElement>(null)

    const { gotoTopStats } = useNavigation()

    const handleClickWhat = (what: TopWhat) => () => {
        setTopWhat(what)
        gotoTopStats(what, parseInt(top), period)
    }

    const handleClickHowMany = (event: MouseEvent<HTMLSpanElement>) => setTopHowManyAnchorEl(event.currentTarget)

    const onHowManySelected = (selectedValue: number) => {
        setTopHowMany(selectedValue)
        gotoTopStats(what, selectedValue, period)
    }

    const handleCloseHowMany = () => setTopHowManyAnchorEl(null)

    const handleClickPeriod = (event: MouseEvent<HTMLSpanElement>) => setTopPeriodAnchorEl(event.currentTarget)

    const onTopPeriodSelected = (selectedValue: TopPeriod) => {
        setTopPeriod(selectedValue)
        gotoTopStats(what, parseInt(top), selectedValue)
    }

    const handleClosePeriod = () => setTopPeriodAnchorEl(null)

    return (
        <div className={classes.root}>
            <Breadcrumbs className={classes.breadcrumbs} aria-label='breadcrumb'>
                <Typography className={classes.caption}>
                    <span className={classes.selector} onClick={handleClickHowMany}>
                        Top {top}
                    </span>{' '}
                </Typography>
                <TopStatsCrumb caption='Artists' active={what === TopWhat.Artists} onClick={handleClickWhat(TopWhat.Artists)} />
                <TopStatsCrumb caption='Albums' active={what === TopWhat.Albums} onClick={handleClickWhat(TopWhat.Albums)} />
                <TopStatsCrumb caption='Tracks' active={what === TopWhat.Tracks} onClick={handleClickWhat(TopWhat.Tracks)} />
                <Typography className={classes.caption}>
                    <span className={classes.selector} onClick={handleClickPeriod}>
                        {captionForTopPeriod(period)}
                    </span>
                </Typography>
            </Breadcrumbs>
            <GroupMenu
                anchorEl={topHowManyAnchorEl}
                options={topHowManyOptions}
                currentValue={Number(top)}
                onSelected={onHowManySelected}
                onClose={handleCloseHowMany}
            />
            <GroupMenu
                anchorEl={TopPeriodAnchorEl}
                options={topPeriodOptions}
                currentValue={period as TopPeriod}
                onSelected={onTopPeriodSelected}
                onClose={handleClosePeriod}
            />
        </div>
    )
}
