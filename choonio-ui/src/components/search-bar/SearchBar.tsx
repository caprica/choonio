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

import React, { useEffect, useMemo, useState } from 'react'

import { alpha, Box } from '@mui/material'

import makeStyles from '@mui/styles/makeStyles'

import Autocomplete from '@mui/material/Autocomplete'

import SearchBarInput from './input/SearchBarInput'
import SearchBarPaper from './paper/SearchBarPaper'
import { isString, throttle } from 'lodash'
import axios from 'axios'

import { useNavigation } from '../../hooks/navigation/useNavigation'
import { captionForMediaId, keyForMediaId, MediaIdentity, MediaType } from '../../api/model/identity-model'
import { useArtistActions } from '../../hooks/actions/useArtistActions'
import { useAlbumActions } from '../../hooks/actions/useAlbumActions'
import { SearchResultData, CombinedSearchResultsData } from '../../api/model/search-model'
import MediaIdSearchBarOption from './options/MediaIdSearchBarOption'
import { useTrackActions } from '../../hooks/actions/useTrackActions'

const useStyles = makeStyles(theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25)
        },
        marginRight: theme.spacing(1),
        marginLeft: 0
        // width: '100%',
        // [theme.breakpoints.up('sm')]: {
        //     //marginLeft: theme.spacing(1),
        //     width: 'auto',
        // },
    },
    option: {
        paddingTop: '0 !important',
        paddingBottom: '0 !important'
    }
}))

const callService = async (req: any, cb: any): Promise<CombinedSearchResultsData> => {
    const { data } = await axios.get(`/api/search/quick?q=${req.input}&limit=100`)
    cb(data)
    return data // why???
}

const SearchBar = () => {
    const classes = useStyles()

    const [value, setValue] = useState<SearchResultData | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<Array<SearchResultData>>([])

    const { shuffleArtist } = useArtistActions()
    const { playAlbum } = useAlbumActions()
    const { playTrack } = useTrackActions()

    const { gotoQuickSearch, gotoMedia } = useNavigation()

    const fetch = useMemo(() => throttle((request, callback) => callService(request, callback), 200), [])

    useEffect(() => {
        let active = true

        if (inputValue === '') {
            setOptions([])
            return undefined
        }

        fetch({ input: inputValue }, (combinedResults: CombinedSearchResultsData) => {
            if (active) {
                let newOptions: Array<SearchResultData>
                if (combinedResults) {
                    newOptions = []
                    if (combinedResults.artists) newOptions = newOptions.concat(combinedResults.artists.results)
                    if (combinedResults.albums) newOptions = newOptions.concat(combinedResults.albums.results)
                    if (combinedResults.tracks) newOptions = newOptions.concat(combinedResults.tracks.results)
                    if (combinedResults.playlists) newOptions = newOptions.concat(combinedResults.playlists.results)
                } else {
                    newOptions = []
                }
                setOptions(newOptions)
            }
        })

        return () => {
            active = false
        }
    }, [value, inputValue, fetch])

    const handleChange = (_evt: React.SyntheticEvent, value: any, reason: string) => {
        if (value) {
            switch (reason) {
                case 'selectOption':
                    gotoMedia((value as SearchResultData).mediaId)
                    setValue(null)
                    setInputValue('')
                    break
                case 'createOption':
                    gotoQuickSearch(value as string)
                    // this actually works, which is good, but i think i want to see a custom entry in the select that is
                    // something like "search results for ..."
                    break
                default:
                    break
            }
        }
    }

    const handleClickPlaySearchOption = (mediaId: MediaIdentity) => {
        // shuffle vs play, it seems more natural on artist to shuffle, and an album to play, but it's awkward
        // it needs to close the popup - there is an open attribute but that's not used currently
        switch (mediaId.type) {
            case MediaType.Artist:
                shuffleArtist(mediaId)
                break
            case MediaType.Album:
                playAlbum(mediaId)
                break
            case MediaType.Track:
                playTrack(mediaId)
                break
        }
    }

    const getOptionLabel = (option: string | SearchResultData) => {
        if (isString(option)) {
            return option
        } else {
            return captionForMediaId(option.mediaId)
        }
    }

    const getOptionKey = (option: string | SearchResultData) => {
        if (isString(option)) {
            return `${option}|string`
        } else {
            return keyForMediaId(option.mediaId)
        }
    }

    const handleClear = () => {
        setInputValue('')
        setOptions([])
    }

    return (
        <div className={classes.search}>
            <Autocomplete
                classes={{ option: classes.option }}
                id='search-term'
                freeSolo
                PaperComponent={SearchBarPaper}
                options={options}
                getOptionLabel={getOptionLabel}
                noOptionsText='No results'
                filterOptions={x => x} // Required for "search as you type"
                renderOption={(props, option) => (
                    <Box component='li' sx={{ '& > img': { mr: 0, flexShrink: 0 } }} {...props} key={getOptionKey(option)}>
                        <MediaIdSearchBarOption mediaId={option.mediaId} onClickPlay={handleClickPlaySearchOption} />
                    </Box>
                )}
                renderInput={params => <SearchBarInput {...params} onClear={handleClear} />}
                onInputChange={(_event, newInputValue) => {
                    setInputValue(newInputValue)
                }}
                onChange={handleChange}
                value={value}
                inputValue={inputValue}
                clearOnBlur
                clearOnEscape
            />
        </div>
    )
}

export default SearchBar
