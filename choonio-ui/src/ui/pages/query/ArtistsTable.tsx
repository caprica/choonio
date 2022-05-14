import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { Artist } from '../../../generated/graphql'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
    artist: {
        cursor: 'pointer'
    },
    active: {
        backgroundColor: theme.palette.primary.light
    }
}))

interface ArtistsTableProps {
    artists: Array<Artist | null> /* FIXME this null type is annoying */
    selected: string | null
    onSelect: (artistName: string) => void
}

export default function ArtistsTable({ artists, selected, onSelect }: ArtistsTableProps) {
    const classes = useStyles()

    const select = (artistName: string) => () => onSelect(artistName)

    return (
        <TableContainer component={Paper}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Artist Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {artists.map(
                        artist =>
                            artist?.mediaId?.artistName && (
                                <TableRow
                                    key={artist.mediaId.artistName}
                                    className={clsx({ [classes.active]: artist.mediaId.artistName === selected }, classes.artist)}
                                    onClick={select(artist.mediaId.artistName)}
                                >
                                    <TableCell>
                                        <Typography variant='body2'>{artist?.mediaId?.artistName}</Typography>
                                    </TableCell>
                                </TableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
