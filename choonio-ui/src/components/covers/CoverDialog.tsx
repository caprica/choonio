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
import Dialog from '@mui/material/Dialog'
import Transition from '../transitions/Transition'

type CoverDialogProps = {
    cover: JSX.Element
    dialogCover: JSX.Element
}

const useStyles = makeStyles({
    dialog: {
        overflowY: 'hidden',
        margin: 0
    }
})

export default function CoverDialog({ cover, dialogCover }: CoverDialogProps) {
    const classes = useStyles()

    const [openCoverDialog, setOpenCoverDialog] = useState(false)

    const handleClickCover = () => setOpenCoverDialog(true)
    const handleCloseDialog = () => setOpenCoverDialog(false)

    return (
        <>
            <div onClick={handleClickCover}>{cover}</div>
            <Dialog
                classes={{ paper: classes.dialog }}
                open={openCoverDialog}
                onClose={handleCloseDialog}
                TransitionComponent={Transition}
                keepMounted={false}
            >
                {dialogCover}
            </Dialog>
        </>
    )
}
