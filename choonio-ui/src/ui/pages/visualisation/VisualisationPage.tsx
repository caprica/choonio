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

import { useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { VisualisationDataContextProvider } from './hooks/data/visualisation-data-context'
import { VisualisationOptionsContextProvider } from './hooks/options/visualisation-options-context'
import { VisualisationPalettesContextProvider } from './hooks/palette/visualisation-palettes-context'
import ToolBox from './toolbox/ToolBox'
import VisualisationHeader from './VisualisationHeader'
import VisualisationCanvas from './VisualisationCanvas'

const useStyles = makeStyles({
    root: {
        backgroundColor: '#1a202c',
        display: 'grid',
        gridTemplateAreas: '"header header" "tools content"',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateRows: 'auto 1fr',
        height: '100vh'
    },
    header: {
        gridArea: 'header',
        color: 'white'
    },
    tools: {
        gridArea: 'tools',
        overflowY: 'auto'
    },
    content: {
        gridArea: 'content',
        overflow: 'auto',
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center'
    }
})

export default function VisualisationPage() {
    const classes = useStyles()

    const [toolsOpen, setToolsOpen] = useState(true)

    const handleOpenToolsDrawer = () => setToolsOpen(!toolsOpen)

    return (
        <VisualisationOptionsContextProvider>
            <VisualisationPalettesContextProvider>
                <VisualisationDataContextProvider>
                    <div id='visualisation-page' className={classes.root}>
                        <VisualisationHeader className={classes.header} onClickTools={handleOpenToolsDrawer} />
                        {toolsOpen && <ToolBox className={classes.tools} />}
                        <VisualisationCanvas className={classes.content} />
                    </div>
                </VisualisationDataContextProvider>
            </VisualisationPalettesContextProvider>
        </VisualisationOptionsContextProvider>
    )
}
