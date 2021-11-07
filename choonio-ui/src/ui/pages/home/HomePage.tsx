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

import Container from '@mui/material/Container'

import makeStyles from '@mui/styles/makeStyles'

import PeriodOfDay from '../../lib/period-of-day/PeriodOfDay'
import Recents from './Recents'
import Favourites from './Favourites'
import Playlists from './Playlists'
import Highlights from '../../../components/highlights/Highlights'
import { ScrollTargetContext } from '../../../hooks/scroll-target/ScrollTargetContext'
import { useContext } from 'react'
import RefreshHighlights from './RefreshHighlights'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 16),
        '& h2': {
            cursor: 'pointer'
        }
    },
    boxThing: {
        // paddingTop: '80%',
        // width: calc((100% - 1px - (var(--column-gutters) * (var(--columns) - 1))) / var(--columns));
        // margin: var(--row-margin) var(--column-gutters) 0 0;
    },
    // it also has the same shadow effect as album covers
    textProtection: {
        border: '1px solid #dcdcdc',
        borderRadius: 2,
        padding: 24,
        width: 300,
        height: 200,
        //        backgroundImage: 'linear-gradient(to top, rgb(211, 242, 242), rgba(211, 242, 242, 0.5))'
        backgroundImage: 'linear-gradient(to top, rgb(255, 222, 8), rgba(255, 222, 8, 0.5))'
    },
    textWrapper: {
        width: '100%',
        height: '100%'
    },
    highlights: {},
    main: {
        gridArea: 'content',
        overflow: 'hidden',
        overflowY: 'auto'
    }
}))

export default function HomePage() {
    const classes = useStyles()

    const { setScrollTarget } = useContext(ScrollTargetContext)

    return (
        <main
            className={classes.main}
            ref={(node: any) => {
                node && setScrollTarget && setScrollTarget(node)
            }}
        >
            <Container className={classes.root} maxWidth='lg'>
                <Recents />
                <Favourites />
                <Playlists />
                <div style={{ display: 'flex' }}>
                    <PeriodOfDay className={classes.highlights} />
                    <RefreshHighlights />
                </div>
                <Highlights />
            </Container>
        </main>
    )
}
