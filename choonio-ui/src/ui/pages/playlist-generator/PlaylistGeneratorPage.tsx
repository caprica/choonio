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

import React, { useMemo, useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import { Autocomplete, Box, Button, Container, FormControl, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import { useGetArtists } from '../../../api/endpoints/artists-controller'
import { useGeneratePlaylist } from '../../../api/endpoints/queue-controller'
import GroupHeading from '../../components/group/GroupHeading'

type GeneratePlaylistRequest = {
    artists: Array<string>
    duration: number
}

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: theme.spacing(4, 8),
        display: 'flex',
        flexDirection: 'column'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: theme.spacing(4),
        padding: theme.spacing(2, 0)
    },
    artists: {},
    duration: {
        width: '20ch'
    },
    actions: {}
}))

export default function PlaylistGeneratorPage() {
    const classes = useStyles()

    const { data } = useGetArtists()

    const [artists, setArtists] = useState<Array<string>>([])
    const [duration, setDuration] = useState(60)

    const artistOptions = useMemo(() => (data ? data.map(artistData => artistData.mediaId.artistName) : []), [data])

    const generatePlaylist = useGeneratePlaylist()

    if (!data) return null

    const handleArtistsChange = (_event: React.SyntheticEvent, newValue: Array<string>) => setArtists(newValue)

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value)
        if (value) {
            setDuration(value)
        } else {
            setDuration(0)
        }
    }

    const handleGeneratePlaylistClick = () => {
        const request: GeneratePlaylistRequest = {
            artists,
            duration
        }
        generatePlaylist(request)
    }

    return (
        <Container className={classes.root} maxWidth='sm'>
            <GroupHeading caption='Playlist Generator' />
            <Paper className={classes.content}>
                <Typography variant='body2'>
                    Generate a random playlist for one oe more artists with an approximate minimum duration.
                </Typography>
                <Box className={classes.container}>
                    <FormControl variant='outlined' fullWidth>
                        <Autocomplete<string, true, false, false>
                            className={classes.artists}
                            id='artistSelect'
                            multiple
                            options={artistOptions}
                            autoHighlight
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label='Choose artists'
                                    inputProps={{
                                        ...params.inputProps
                                    }}
                                />
                            )}
                            value={artists}
                            onChange={handleArtistsChange}
                        />
                    </FormControl>
                    <FormControl variant='outlined'>
                        <TextField
                            className={classes.duration}
                            id='duration'
                            label='Duration'
                            value={duration}
                            onChange={handleDurationChange}
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>minutes</InputAdornment>
                            }}
                            aria-describedby='duration-helper-text'
                            inputProps={{
                                'aria-label': 'duration'
                            }}
                        />
                    </FormControl>
                    <div className={classes.actions}>
                        <Button onClick={handleGeneratePlaylistClick}>Generate Playlist</Button>
                    </div>
                </Box>
            </Paper>
        </Container>
    )
}
