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

import clsx from 'clsx'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import makeStyles from '@mui/styles/makeStyles'

import { MdMenu as MenuIcon } from 'react-icons/md'
import { useNavigation } from '../../../hooks/navigation/useNavigation'

const useStyles = makeStyles(theme => ({
    root: {
        borderBottom: '1px solid #e0e0e0'
    },
    menuButton: {
        marginRight: theme.spacing(2.5)
    },
    toolbar: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        columnGap: theme.spacing(4)
    },
    left: {
        marginLeft: theme.spacing(0.5),
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    center: {
        alignItems: 'center'
    },
    right: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: theme.spacing(0.5)
    },
    title: {
        cursor: 'pointer'
    }
}))

interface VisualisationHeaderProps {
    className?: string
    onClickTools: () => void
}

export default function VisualisationHeader({ className, onClickTools }: VisualisationHeaderProps) {
    const classes = useStyles()

    const { gotoHome } = useNavigation()

    const handleClickTitle = () => gotoHome()

    return (
        <>
            <AppBar className={clsx(className, classes.root)}>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.left}>
                        <IconButton
                            edge='start'
                            className={classes.menuButton}
                            color='inherit'
                            aria-label='open tools'
                            onClick={onClickTools}
                            size='medium'
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant='h6' onClick={handleClickTitle}>
                            Choonio
                        </Typography>
                        {/* <Logo/> */}
                    </div>
                    <div className={classes.center}>
                        <Typography variant='h6'>Visualiser</Typography>
                    </div>
                    <div className={classes.right}></div>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    )
}
