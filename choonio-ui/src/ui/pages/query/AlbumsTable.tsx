import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useGetAlbumsByArtistQuery } from '../../../generated/graphql'

interface AlbumsTableProps {
    artistName: string
}

export default function AlbumsTable({ artistName }: AlbumsTableProps) {
    const { data } = useGetAlbumsByArtistQuery({ artistName })

    if (!data?.albumsByArtist) return null

    return (
        <TableContainer component={Paper}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Albums</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.albumsByArtist.map(album => (
                        <TableRow key={`${album?.mediaId?.albumArtistName}|${album?.mediaId?.albumName}`}>
                            <TableCell>
                                <Typography variant='body2'>{album?.mediaId?.albumName}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
