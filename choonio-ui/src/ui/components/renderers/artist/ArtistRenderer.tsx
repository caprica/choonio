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

import makeStyles from '@mui/styles/makeStyles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Highlighter from 'react-highlight-words'
import ArtistCover from '../../../../components/covers/ArtistCover'

import { ArtSize } from '../../../../api/model/art-model'

const useStyles = makeStyles({
    root: {
        backgroundColor: 'transparent',
        margin: 8,
        verticalAlign: 'top',

        overflow: 'visible',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        position: 'relative',
        borderRadius: '2px',
        fontWeight: 300,
        cursor: 'pointer',

        userSelect: 'none',
        // '& > div > div:first-child:hover': {

        '& > div:first-child:hover': {
            boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.3)'
        }

        // ':hover': {
        //            boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.3)'
        // }
    },
    imageWrapper: {
        position: 'relative',
        borderRadius: '50%',
        backgroundColor: 'white',
        margin: '0 15px',
        paddingTop: 'calc(100% - 30px)',
        width: 'calc(100% - 30px)',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.37)',
        transition: 'box-shadow 0.28s cubic-bezier(0.4,0,0.2,1)'
        // '& div :hover': {
        //    boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.3)'
        // }
    },
    imageInnerWrapper: {
        position: 'absolute',
        top: 0,
        borderRadius: '2px 2px 0 0',
        width: '100%',
        height: '100%'
    },
    media: {
        verticalAalign: 'top',
        borderRadius: '50%',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        margin: '4px',
        cursor: 'pointer',
        display: 'inline-block'
        // position: 'relative',
    },
    details: {
        padding: 0,
        textAlign: 'center',
        margin: '15px auto',
        width: 'calc(100% - 30px)',
        position: 'relative',
        marginBottom: 0 // differes here, but maybe how the flex is laying out across rows
    },
    detailsInner: {
        width: 'calc(100% - 20px)',
        margin: '0 auto',
        position: 'relative',
        flex: 1,
        minWidth: 0
    },
    // the fade doesn't work here, but google play don't use it either it seems
    title: {
        height: '36px',
        verticalAlign: 'top',
        whiteSpace: 'normal',
        overflow: 'hidden',
        display: 'inline-block',
        width: '100%',

        fontSize: '15px',
        lineHeight: '18px',
        fontWeight: 400,
        color: '#212121',
        // textDecoration: 'none',
        cursor: 'pointer',
        outline: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
})

interface ArtistRendererProps {
    artistName: string
    highlight?: string
    onClick: () => void
}

export default function ArtistRenderer({ artistName, highlight, onClick }: ArtistRendererProps) {
    const classes = useStyles()

    return (
        <Card className={classes.root} elevation={0} onClick={onClick}>
            <div className={classes.imageWrapper}>
                <div className={classes.imageInnerWrapper}>
                    <ArtistCover className={classes.media} artistName={artistName} size={ArtSize.Medium} />
                </div>
            </div>
            <CardContent className={classes.details}>
                <div className={classes.detailsInner}>
                    <Typography className={classes.title} variant='body2' component='p'>
                        {highlight ? (
                            <Highlighter searchWords={[highlight]} autoEscape={true} textToHighlight={artistName} />
                        ) : (
                            artistName
                        )}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    )
}
