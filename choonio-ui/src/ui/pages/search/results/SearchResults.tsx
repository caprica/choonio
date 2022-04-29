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

import makeStyles from '@mui/styles/makeStyles'
import ItemGrid from '../../../../components/item-grid/ItemGrid'
import { useItemGridColumns } from '../../../../hooks/item-grid/useItemGridColumns'
import { useNavigation } from '../../../../hooks/navigation/useNavigation'
import SearchResultRenderer from '../../../../components/renderers/item-grid/search/SearchResultRenderer'

import { pluralise } from '../../../../lib/pluralise/pluralise'
import SearchResultHeading from './SearchResultHeading'
import { SearchResultData, SearchResultsData } from '../../../../api/model/search-model'
import { keyForMediaId } from '../../../../api/model/identity-model'

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4)
    }
}))

interface SearchResultsProps {
    caption: string
    searchResults: SearchResultsData
}

export default function SearchResults({ caption, searchResults }: SearchResultsProps) {
    const classes = useStyles()

    const columns = useItemGridColumns()

    const { gotoMedia } = useNavigation()

    if (searchResults.results.length === 0) return null

    const handleClick = (item: SearchResultData) => () => gotoMedia(item.mediaId)

    return (
        <div className={classes.root}>
            <SearchResultHeading caption={`${pluralise(caption, searchResults.results.length)}`} />
            <ItemGrid
                columns={columns}
                columnWidth={200}
                items={searchResults.results}
                renderItem={item => (
                    <SearchResultRenderer key={keyForMediaId(item.mediaId)} item={item} onClick={handleClick(item)} />
                )}
                emptyCaption='There are no search results'
            />
        </div>
    )
}
