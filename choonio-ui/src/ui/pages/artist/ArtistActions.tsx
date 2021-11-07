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

import { Button, IconButton } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { MdMoreVert } from 'react-icons/md'
import { MouseEvent } from 'react'

import RadioIcon from '../../../components/radio-icon/RadioIcon'
import { useArtistMenu } from '../../../components/context/menus/artist/ArtistMenuContext'
import { useArtistActions } from '../../../hooks/actions/useArtistActions'
import { ArtistIdentity } from '../../../api/model/identity-model'

const useStyles = makeStyles({
    root: {
        color: 'rgba(0, 0, 0, 0.87)'
    },
    action: {
        marginLeft: '-6px',
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 600,
        textTransform: 'uppercase',
        columnGap: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        '& svg': {
            fontSize: '16px'
        }
    },
    iconButton: {
        fontSize: '14px',
        padding: 8,
        color: 'rgba(0, 0, 0, 0.87)',
        '& svg': {
            width: 20,
            height: 20
        },

        height: 36
    },
    menu: {
        padding: '16px 0'
    },
    menuItem: {
        fontSize: '15px',
        padding: '0 24px',
        height: '32px',
        lineHeight: '32px',
        margin: '0!important',
        color: '#212121',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    divider: {
        margin: '6px 0',
        background: '#eeeeee!important',
        border: 'none!important',
        height: '1px!important'
    }
})

interface ArtistActionsProps {
    item: ArtistIdentity
}

export default function ArtistActions({ item }: ArtistActionsProps) {
    const classes = useStyles()

    const { openArtistMenu } = useArtistMenu()

    const { shuffleArtist } = useArtistActions()

    const handleClickMenu = (event: MouseEvent<HTMLElement>) => openArtistMenu(item, event.currentTarget)

    const handleClickRadio = () => shuffleArtist(item)

    return (
        <div className={classes.root}>
            <div className={classes.action}>
                <Button className={classes.iconButton} startIcon={<RadioIcon />} onClick={handleClickRadio}>
                    Radio
                </Button>
                <IconButton className={classes.iconButton} onClick={handleClickMenu} size='large'>
                    <MdMoreVert />
                </IconButton>
            </div>
        </div>
    )
}
