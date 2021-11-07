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

import { Paper } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles({
    root: {},
    paper: {
        margin: 0
    }
})

interface SearchBarPaperProps {
    children?: any
    other?: Array<any>
}

export default function SearchBarPaper({ children, ...other }: SearchBarPaperProps) {
    const classes = useStyles()

    return (
        <Paper className={classes.root} classes={{ root: classes.paper }} {...other} square elevation={6}>
            {children}
        </Paper>
    )
}
