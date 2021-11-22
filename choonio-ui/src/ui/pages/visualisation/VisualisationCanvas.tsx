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

import { Box, Fade, IconButton, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { toPng } from 'html-to-image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MdFileDownload } from 'react-icons/md'
import { MediaType } from '../../../api/model/identity-model'
import { ArtistPlaysData } from '../../../api/model/plays-model'
import { useNavigation } from '../../../hooks/navigation/useNavigation'
import { FILENAME_TIMESTAMP_FORMAT } from '../../../lib/date-format/date-format'
import { generateWordCloud } from './lib/word-cloud'
import { useVisualisationData } from './hooks/data/visualisation-data-context'

import { useVisualisationOptions } from './hooks/options/visualisation-options-context'
import { useVisualisationPalettes } from './hooks/palette/visualisation-palettes-context'

import { TextTransformMode, transformText } from './lib/text-transform'
import AbortVisualisationModal from './AbortVisualisationModal'

import '../../../assets/css/fonts.css'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr',
        rowGap: 1,
        columnGap: theme.spacing(2),
        alignItems: 'center'
    },
    bottom: {
        color: 'white',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'baseline'
    },
    footer: {
        marginTop: theme.spacing(1)
    },
    download: {}
}))

interface VisualisationCanvasProps {
    className?: string
}

const convertListensToWeightedWords = (listens: Array<ArtistPlaysData>, options: any) => {
    // Could be better...
    let mode = TextTransformMode.NoChange
    switch (options.textMode) {
        case 'upper case':
            mode = TextTransformMode.UpperCase
            break
        case 'lower case':
            mode = TextTransformMode.LowerCase
            break
        case 'title case':
            mode = TextTransformMode.TitleCase
            break
        case 'no change':
            mode = TextTransformMode.NoChange
            break
    }

    return listens
        .filter(listen => listen.listens >= options.minimumCount)
        .filter(listen => listen.mediaId.artistName !== 'Various Artists')
        .map(listen => {
            return {
                original: listen.mediaId.artistName,
                word: transformText(listen.mediaId.artistName, mode),
                weight: listen.listens
            }
        })
}

export default function VisualisationCanvas({ className }: VisualisationCanvasProps) {
    const classes = useStyles()

    const [abortModal, setAbortModal] = useState(false)

    const { listens } = useVisualisationData()

    const ref = useRef<HTMLCanvasElement>(null)

    const { options } = useVisualisationOptions()

    const { palettes } = useVisualisationPalettes()

    const { gotoArtist } = useNavigation()

    const handleAborted = () => setAbortModal(false)

    const handleCloseAbortModal = () => setAbortModal(false)

    const handleClickArtist = useCallback(
        (artistName: string) => {
            gotoArtist({
                type: MediaType.Artist,
                artistName
            })
        },
        [gotoArtist]
    )

    const handleClickDownload = useCallback(() => {
        if (ref.current === null) return
        toPng(ref.current, { cacheBust: true })
            .then(dataUrl => {
                const link = document.createElement('a')
                const filename = 'choonio-visualisation'
                link.download = `${filename}_${dayjs().format(FILENAME_TIMESTAMP_FORMAT)}.png`
                link.href = dataUrl
                link.click()
            })
            .catch(err => {
                console.log(err)
            })
    }, [ref])

    useEffect(() => {
        generateWordCloud(
            ref.current,
            convertListensToWeightedWords(listens || [], options),
            options,
            palettes,
            handleAborted,
            handleClickArtist
        )
    }, [listens, options, palettes, handleClickArtist])

    return (
        <>
            <div className={className}>
                <canvas
                    style={{ backgroundColor: 'black' }}
                    id='visualisation-canvas'
                    ref={ref}
                    width={options.width}
                    height={options.height}
                />
                <div className={classes.bottom}>
                    <div className={classes.footer}>Save image</div>
                    <span className={classes.download}>
                        <IconButton onClick={handleClickDownload} size='small' color='inherit'>
                            <MdFileDownload />
                        </IconButton>
                    </span>
                </div>
            </div>
            <AbortVisualisationModal open={abortModal} onClose={handleCloseAbortModal} />
        </>
    )
}
