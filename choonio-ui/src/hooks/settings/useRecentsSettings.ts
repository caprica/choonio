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

import createPersistedState from 'use-persisted-state'

export enum RecentsGrouping {
    ByDate = 'by-date',
    ByName = 'by-name',
    ByPeriod = 'by-period',
    ByType = 'by-type'
}

const captions = new Map()
captions.set(RecentsGrouping.ByDate, 'by date')
captions.set(RecentsGrouping.ByPeriod, 'by period')
captions.set(RecentsGrouping.ByName, 'by name')
captions.set(RecentsGrouping.ByType, 'by type')

export const captionForRecentsGrouping = (value: string) => captions.get(value)

const DEFAULT_RECENTS_GROUP = RecentsGrouping.ByDate

const useRecentsGroupState = createPersistedState<RecentsGrouping>('recentsGroup')

export const useRecentsSettings = () => {
    const [recentsGroup, setRecentsGroup] = useRecentsGroupState(DEFAULT_RECENTS_GROUP)

    return {
        recentsGroup,
        setRecentsGroup: (group: RecentsGrouping) => setRecentsGroup(group)
    }
}
