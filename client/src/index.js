import React, {createContext} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import UserGlobal from './store/UserGlobal'
import TariffGlobal from './store/TariffGlobal'

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserGlobal(),
        tariff: new TariffGlobal()
    }}>
        <App/>
    </Context.Provider>,
    document.getElementById('root')
)