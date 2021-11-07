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

package uk.co.caprica.choonio.database.criteria;

import org.springframework.data.mongodb.core.query.Criteria;
import uk.co.caprica.choonio.api.model.identity.AlbumId;
import uk.co.caprica.choonio.api.model.identity.ArtistId;
import uk.co.caprica.choonio.api.model.identity.MediaId;
import uk.co.caprica.choonio.api.model.identity.PlaylistId;
import uk.co.caprica.choonio.api.model.identity.TrackId;

import static org.springframework.data.mongodb.core.query.Criteria.where;

public final class MediaIdCriteria {

    public static Criteria mediaIdCriteria(MediaId mediaId) {
        Criteria criteria = where("mediaId.type").is(mediaId.getType());
        switch (mediaId.getType()) {
            case ARTIST -> criteria
                .and("mediaId.artistName").is(((ArtistId) mediaId).getArtistName());
            case ALBUM -> criteria
                .and("mediaId.albumArtistName").is(((AlbumId) mediaId).getAlbumArtistName())
                .and("mediaId.albumName").is(((AlbumId) mediaId).getAlbumName());
            case TRACK -> criteria
                .and("mediaId.albumArtistName").is(((TrackId) mediaId).getAlbumArtistName())
                .and("mediaId.albumName").is(((TrackId) mediaId).getAlbumName())
                .and("mediaId.trackName").is(((TrackId) mediaId).getTrackName());
            case PLAYLIST -> criteria
                .and("mediaId.playlistName").is(((PlaylistId) mediaId).getPlaylistName());
        }
        return criteria;
    }
}
