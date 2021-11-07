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

import { ReactNode } from 'react'
import { AlbumMenuProvider } from './album/AlbumMenuContext'
import { ArtistMenuProvider } from './artist/ArtistMenuContext'
import { FavouriteMenuProvider } from './favourite/FavouriteMenuContext'
import { PlaylistMenuProvider } from './playlist/PlaylistMenuContext'
import { RecentMenuProvider } from './recent/RecentMenuContext'
import { TrackMenuProvider } from './track/TrackMenuContext'

export default function MenuProviders({ children }: MenuProvidersProps) {
    return (
        <RecentMenuProvider>
            <FavouriteMenuProvider>
                <PlaylistMenuProvider>
                    <ArtistMenuProvider>
                        <AlbumMenuProvider>
                            <TrackMenuProvider>{children}</TrackMenuProvider>
                        </AlbumMenuProvider>
                    </ArtistMenuProvider>
                </PlaylistMenuProvider>
            </FavouriteMenuProvider>
        </RecentMenuProvider>
    )
}

interface MenuProvidersProps {
    children: ReactNode
}
