import { useState } from 'react'
import { Container, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import AlbumsTable from './AlbumsTable'
import ArtistsTable from './ArtistsTable'
import { useGetArtistsQuery } from '../../../generated/graphql'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 8)
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: theme.spacing(4)
    },
    caption: {
        marginBottom: theme.spacing(4)
    }
}))

export default function QueryPage() {
    const classes = useStyles()

    const [selected, setSelected] = useState<string | null>(null)

    const { data } = useGetArtistsQuery({
        // endpoint: 'http://localhost:8080/graphql',
        // fetchParams: {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }
    })

    return (
        <Container className={classes.root} maxWidth='lg'>
            <Typography variant='h6' className={classes.caption}>
                GraphQL Interface
            </Typography>
            {data && data.artists && (
                <div className={classes.content}>
                    <ArtistsTable artists={data.artists} selected={selected} onSelect={setSelected} />
                    {selected && <AlbumsTable artistName={selected} />}
                </div>
            )}
        </Container>
    )
}
