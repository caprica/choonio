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
import { useParams } from 'react-router-dom'

import SearchSummary from './results/SearchSummary'
import { SearchProvider, useSearch } from '../../../hooks/search/SearchContext'
import { useGetQuickSearchResults } from '../../../api/endpoints/search-controller'
import SearchResults from './results/SearchResults'
import invariant from 'tiny-invariant'
import { useEffect } from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4, 8)
    }
}))

// This needs a wrapper component because the hook in the content uses the provider/context
export default function SearchPage() {
    return (
        <SearchProvider>
            <SearchContent />
        </SearchProvider>
    )
}

function SearchContent() {
    const classes = useStyles()

    const { query } = useParams()
    invariant(query)

    const { data: searchResults } = useGetQuickSearchResults(query)

    const { setSearchResults } = useSearch()

    // Store the search results in context so that the nested renderers can use those results to, for example, provide
    // highiighted text
    useEffect(() => {
        setSearchResults(searchResults)
    }, [searchResults, setSearchResults])

    if (!searchResults) return null

    return (
        <div className={classes.root}>
            <SearchSummary results={searchResults} />
            <SearchResults caption='Artist' searchResults={searchResults.artists} />
            <SearchResults caption='Album' searchResults={searchResults.albums} />
            <SearchResults caption='Playlist' searchResults={searchResults.playlists} />
            <SearchResults caption='Track' searchResults={searchResults.tracks} />
        </div>
    )
}
