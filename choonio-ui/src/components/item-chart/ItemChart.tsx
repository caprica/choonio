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

import { IconButton, Paper, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import dayjs from 'dayjs'
import { toPng } from 'html-to-image'
import { useCallback, useRef } from 'react'
import { MdFileDownload } from 'react-icons/md'
import { FILENAME_TIMESTAMP_FORMAT } from '../../lib/date-format/date-format'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    content: {
        // marginTop: theme.spacing(2),
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr',
        rowGap: 1,
        // rowGap: theme.spacing(1),
        columnGap: theme.spacing(2),
        alignItems: 'center'
    },
    bottom: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'baseline'
    },
    footer: {
        marginTop: theme.spacing(1)
    },
    download: {}
}))

interface ItemChartProps<T> {
    items: Array<T>
    emptyCaption: string
    renderItem: (item: T, rank: number) => React.ReactNode
    footer?: JSX.Element
    filename: string
}

export default function ItemChart<T>({ items, emptyCaption, renderItem, footer, filename }: ItemChartProps<T>) {
    const classes = useStyles()

    const ref = useRef<HTMLDivElement>(null)

    const handleClickDownload = useCallback(() => {
        if (ref.current === null) return
        toPng(ref.current, { cacheBust: true })
            .then(dataUrl => {
                const link = document.createElement('a')
                link.download = `${filename}_${dayjs().format(FILENAME_TIMESTAMP_FORMAT)}.png`
                link.href = dataUrl
                link.click()
            })
            .catch(err => {
                console.log(err)
            })
    }, [ref, filename])

    return (
        <div>
            <div ref={ref}>
                <Paper className={classes.root} square elevation={3}>
                    {items.length > 0 ? (
                        <div className={classes.content}>
                            {items.map((item: T, index: number) => renderItem(item, index + 1))}
                        </div>
                    ) : (
                        <Typography variant='body1'>{emptyCaption}</Typography>
                    )}
                </Paper>
            </div>
            <div className={classes.bottom}>
                {footer && <div className={classes.footer}>{footer}</div>}
                <span className={classes.download}>
                    <IconButton onClick={handleClickDownload} size='small'>
                        <MdFileDownload />
                    </IconButton>
                </span>
            </div>
        </div>
    )
}
