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

import { ReactNode, createContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { eventsUrl } from '../../config/service-endpoints'
import { collectionQueryCacheMap } from './collection-query-cache'

import {
    ApplicationStatus,
    CollectionChangedEvent,
    NowPlayingData,
    PlayerStateData,
    RepeatMode,
    ServerSentEventType,
    ShuffleMode,
    ApplicationStatusData
} from '../../api/model/event-model'

const DEFAULT_STATUS: ApplicationStatusData = {
    status: ApplicationStatus.Unknown
}

const DEFAULT_PLAYER_STATE: PlayerStateData = {
    playing: false,
    duration: 0,
    time: 0,
    position: 0,
    volume: 0,
    repeat: RepeatMode.NoRepeat,
    shuffle: ShuffleMode.NoShuffle,
    timestamp: 0
}

export interface ServerSentEventsContextProps {
    status: ApplicationStatusData
    playerState: PlayerStateData
    nowPlaying?: NowPlayingData
}

export const ServerSentEventsContext = createContext<ServerSentEventsContextProps>({
    status: DEFAULT_STATUS,
    playerState: DEFAULT_PLAYER_STATE
})

interface ServerSentEventsProviderProps {
    children?: ReactNode
}

/**
 * A bridge between media player events sent by the server and local media player state.
 *
 * @param param0 destructured component properties
 */
export function ServerSentEventsProvider({ children }: ServerSentEventsProviderProps) {
    const [status, setStatus] = useState<ApplicationStatusData>(DEFAULT_STATUS)
    const [playerState, setPlayerState] = useState<PlayerStateData>(DEFAULT_PLAYER_STATE)
    const [nowPlaying, setNowPlaying] = useState<NowPlayingData | undefined>(undefined) // should be another PlayerEventType really?

    // we need the timestamp for the event, e.g. for position
    // so instead of position: number i need position: { value: number, timestamp: number }?
    // i might not actually need the timestamp trick anymore anyway, not sure

    const queryClient = useQueryClient()

    const statusChanged = (event: ApplicationStatusData) => setStatus(event)

    const playerStateChanged = (event: PlayerStateData) => setPlayerState(event)

    const nowPlayingChanged = (event: NowPlayingData) => setNowPlaying(event.trackId ? event : undefined)

    const collectionChanged = (event: CollectionChangedEvent) => {
        const collectionNames = collectionQueryCacheMap.get(event.name)
        collectionNames?.forEach(collectionName => queryClient.invalidateQueries([collectionName]))
    }

    const parseEventData = (event: Event) => {
        const messageEvent = event as MessageEvent
        return JSON.parse(messageEvent.data)
    }

    useEffect(() => {
        const events: EventSource = new EventSource(eventsUrl())

        // Fired if e.g. the server goes away
        events.onerror = (_ev: Event) => setStatus({ status: ApplicationStatus.Unknown })

        events.addEventListener(ServerSentEventType.StatusChanged, (event: Event) => statusChanged(parseEventData(event)))
        events.addEventListener(ServerSentEventType.PlayerState, (event: Event) => playerStateChanged(parseEventData(event)))
        events.addEventListener(ServerSentEventType.NowPlaying, (event: Event) => nowPlayingChanged(parseEventData(event)))
        events.addEventListener(ServerSentEventType.CollectionChanged, (event: Event) => collectionChanged(parseEventData(event)))

        return () => events.close()
    }, [])

    return (
        <ServerSentEventsContext.Provider value={{ status, playerState, nowPlaying }}>
            {children}
        </ServerSentEventsContext.Provider>
    )
}
