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

import { ReactNode, useState, createContext, useContext } from 'react'
import { CombinedSearchResultsData } from '../../api/model/search-model'

/**
 *
 */
const SearchContext = createContext({} as SearchContextType)

interface SearchContextType {
    searchResults?: CombinedSearchResultsData
    setSearchResults: (searchResults: CombinedSearchResultsData | undefined) => void
}

export function SearchProvider({ children }: SearchProviderProps) {
    const [searchResults, setSearchResults] = useState<CombinedSearchResultsData | undefined>(undefined)
    return <SearchContext.Provider value={{ searchResults, setSearchResults }}>{children}</SearchContext.Provider>
}

interface SearchProviderProps {
    children: ReactNode
}

export const useSearch = () => useContext(SearchContext)
