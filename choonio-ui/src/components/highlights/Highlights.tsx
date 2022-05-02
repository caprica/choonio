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
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useGetHighlights } from '../../api/endpoints/highlights-controller'
import { increment } from '../../lib/numbers/increment'

import Highlight from './Highlight'

const variants = {
    hidden: {
        opacity: 0
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
            // ease: 'easeInOut',
            // duration: 3
        }
    }
}

const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
        display: 'flex',
        flexWrap: 'wrap',
        paddingBottom: 100,
        gap: 22
    }
}))

export default function Highlights() {
    const classes = useStyles()

    const { data: highlights } = useGetHighlights()

    const [key, setKey] = useState(0)

    useEffect(() => setKey(key => increment(key)), [highlights])

    return (
        <>
            {highlights && (
                <AnimatePresence exitBeforeEnter>
                    <motion.div
                        key={key}
                        className={classes.root}
                        variants={variants}
                        initial='hidden'
                        animate='show'
                        exit='hidden'
                    >
                        {highlights.map(highlight => (
                            <motion.div key={highlight.id} variants={item}>
                                <Highlight highlight={highlight} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    )
}
