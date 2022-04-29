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

import axios from 'axios'
import { useMutation } from 'react-query'
import { rateTrackUrl } from '../../config/service-endpoints'
import { TrackIdentity } from '../model/identity-model'
import { RatingRequest } from '../model/ratings-model'

const putTrackRating = async ({ trackId, rating }: { trackId: TrackIdentity; rating: RatingRequest }) => {
    return axios.put(rateTrackUrl(trackId.albumArtistName, trackId.albumName, trackId.trackName), rating)
}

export const useRateTrack = () => {
    const mutator = useMutation(putTrackRating)
    return (trackId: TrackIdentity, rating: RatingRequest, onSuccess?: () => void) =>
        mutator.mutate({ trackId, rating }, { onSuccess })
}
