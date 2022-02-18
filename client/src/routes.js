import {
    ADMIN_ROUTE,
    ERROR_ROUTE,
    LOGIN_ROUTE,
    MANAGER_ROUTE,
    REGISTRATION_ROUTE,
    SALESMAN_ROUTE,
    SUBSCRIBER_ROUTE,
    TARIFFS_ROUTE
} from './utils/consts'

import Salesman from './pages/Salesman'
import Subscriber from './pages/Subscriber'
import Tariffs from './pages/Tariffs'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Manager from './pages/Manager'
import Error from './pages/Error'

export const authAdminRoutes = [
    {
        path: ADMIN_ROUTE,
        element: <Admin/>
    }
]

export const authManagerRoutes = [
    {
        path: MANAGER_ROUTE,
        element: <Manager/>
    }
]

export const authSalesmanRoutes = [
    {
        path: SALESMAN_ROUTE,
        element: <Salesman/>
    }
]

export const authSubscriberRoutes = [
    {
        path: SUBSCRIBER_ROUTE,
        element: <Subscriber/>
    }
]

export const publicRoutes = [
    {
        path: TARIFFS_ROUTE,
        element: <Tariffs/>
    },
    {
        path: LOGIN_ROUTE,
        element: <Auth/>
    },
    {
        path: REGISTRATION_ROUTE,
        element: <Auth/>
    },
    {
        path: ERROR_ROUTE,
        element: <Error/>
    }
]