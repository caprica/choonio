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

import { Navigate, Route, Routes } from 'react-router-dom'

import { Container } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

import TopArtists from './TopArtists'
import TopAlbums from './TopAlbums'
import TopTracks from './TopTracks'
import TopStatsNav from './TopStatsNav'
import { useTopStatsSettings } from '../../../../hooks/settings/useTopStatsSettings'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    link: {
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}))

export default function TopStatsPage() {
    const classes = useStyles()

    const { topWhat, topPeriod } = useTopStatsSettings()

    return (
        <Container className={classes.root} maxWidth='sm'>
            <Routes>
                <Route path=':what/:period' element={<TopStatsNav />} />
            </Routes>
            <Routes>
                <Route path='' element={<Navigate to={`${topWhat}/${topPeriod}`} />} />
                <Route path=':top/artists' element={<Navigate to={`artists/${topPeriod}`} />} />
                <Route path=':top/albums' element={<Navigate to={`albums/${topPeriod}`} />} />
                <Route path=':top/tracks' element={<Navigate to={`tracks/${topPeriod}`} />} />
                <Route path='artists/:period' element={<TopArtists />} />
                <Route path='albums/:period' element={<TopAlbums />} />
                <Route path='tracks/:period' element={<TopTracks />} />
            </Routes>
        </Container>
    )
}
