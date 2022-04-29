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

import makeStyles from '@mui/styles/makeStyles'
import Container from '@mui/material/Container'
import { ReactNode } from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(9, 4)
    }
}))

interface MediaViewProps {
    header: ReactNode
    children: ReactNode
    onClickPlay?: () => void
}

/**
 * A general media view component that provides a header section and body content.
 *
 * @param component properties
 * @returns component
 */
export default function MediaView({ header, children }: MediaViewProps) {
    const classes = useStyles()

    return (
        <Container maxWidth='xl'>
            <div className={classes.root}>
                {header}
                <div>{children}</div>
            </div>
        </Container>
    )
}
