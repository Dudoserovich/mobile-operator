import React, {useContext} from 'react'
import {Routes, Route} from 'react-router-dom'
import {authAdminRoutes, authManagerRoutes, authSalesmanRoutes, authSubscriberRoutes, publicRoutes} from '../routes'
import {Context} from '../index'
import {observer} from 'mobx-react-lite'
import Tariffs from '../pages/Tariffs'

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    return (
        <Routes>
            {user.isAuth && user.typeId === 1 && authAdminRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element}/>
            )}
            {user.isAuth && user.typeId === 2 && authManagerRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element}/>
            )}
            {user.isAuth && user.typeId === 3 && authSalesmanRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element}/>
            )}
            {user.isAuth && user.typeId === 4 && authSubscriberRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element}/>
            )}
            {publicRoutes.map(({path, element}) =>
                <Route key={path} path={path} element={element}/>
            )}
            <Route path="*" element={<Tariffs/>}/>
        </Routes>
    )
})

export default AppRouter
