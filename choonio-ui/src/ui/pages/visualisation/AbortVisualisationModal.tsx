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

import { Box, Divider, Fade, Modal, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import theme from '../../../config/theme'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 550,
        height: 180,
        padding: 32,
        backgroundColor: '#666666',
        border: '2px solid #000'
    },
    topDivider: {
        marginBottom: theme.spacing(4)
    },
    bottomDivider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    button: {
        width: '5em',
        float: 'right'
    }
}))

interface AbortVisualisationModalProps {
    open: boolean
    onClose: () => void
}

export default function AbortVisualisationModal({ open, onClose }: AbortVisualisationModalProps) {
    const classes = useStyles()

    const handleClose = () => onClose()

    return (
        <Modal className={classes.root} open={open} onClose={handleClose} closeAfterTransition>
            {/* <Fade in={open}> */}
            <Box>
                <Typography variant='h6' component='h2'>
                    The visualisation is taking too long to draw
                </Typography>
                <Divider className={classes.topDivider} />
                <Typography>Try reducing the scale setting in the tool palette, start with small values.</Typography>
                <Typography>Sometimes values as low as 0.01 may be required depending on your data.</Typography>
                <Typography>You can always increase it later once your visualisation starts working.</Typography>
                <Divider className={classes.bottomDivider} />
                <Typography>
                    <button className={classes.button} onClick={handleClose}>
                        OK
                    </button>
                </Typography>
            </Box>
            {/* </Fade> */}
        </Modal>
    )
}
