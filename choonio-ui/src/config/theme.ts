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

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#ff4500' // same as 'orangered'
            // main: '#a800ff'
        },
        secondary: {
            main: '#ffffff'
        }
        // type: 'dark'
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 1072,
            md: 1304,
            lg: 1536,
            xl: 1768
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    // backgroundColor: 'white'
                }
            }
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.6)'
                }
            }
        },
        MuiDrawer: {
            defaultProps: {
                BackdropProps: {
                    style: {
                        opacity: 0
                    }
                }
            }
        }
    }
})

export default theme
