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

import trackPlaying from './track-playing.gif'
import trackNotPlaying from './track-not-playing.gif'
import { usePlayerState } from '../../hooks/server-sent-events/usePlayerState'

const styles = {
    marginRight: -6,
    height: 35
}

/**
 * Properties for the component.
 */
interface TrackPlayingProps {
    className?: string
}

/**
 * A component the renders a different icon whether a track is currently being played or not.
 *
 * @param param0 destructured component properties
 */
export default function TrackPlaying({ className }: TrackPlayingProps) {
    const { playing } = usePlayerState()

    return <img className={className} src={playing ? trackPlaying : trackNotPlaying} style={styles} alt='Track playing' />
}
