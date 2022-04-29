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
import MediaViewListCell from '../MediaViewListCell'
import Rating from './Rating'
import { useRateTrack } from '../../../../api/endpoints/ratings-controller'
import { AlbumTrackData } from '../../../../api/model/albums-model'
import { RatingType } from '../../../../api/model/ratings-model'

const useStyles = makeStyles({
    ratingColumn: {
        width: '90px'
    }
})

interface RatingCellProps {
    track: AlbumTrackData
    active?: boolean
}

export default function RatingCell({ track, active }: RatingCellProps) {
    const classes = useStyles()

    const rateTrack = useRateTrack()

    const handleClickThumbsUp = () => {
        const newRating = track.stats && track.stats.rating !== RatingType.ThumbsUp ? RatingType.ThumbsUp : RatingType.Neutral
        applyRating(newRating)
    }

    const handleClickThumbsDown = () => {
        const newRating = track.stats && track.stats.rating !== RatingType.ThumbsDown ? RatingType.ThumbsDown : RatingType.Neutral
        applyRating(newRating)
    }

    const applyRating = (rating: RatingType) => rateTrack(track.mediaId, { rating })

    return (
        <MediaViewListCell className={classes.ratingColumn} align='left'>
            <Rating
                value={track.stats ? track.stats.rating : RatingType.Neutral}
                active={active}
                onClickThumbsUp={handleClickThumbsUp}
                onClickThumbsDown={handleClickThumbsDown}
            />
        </MediaViewListCell>
    )
}
