import React, {createContext} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import UserGlobal from './store/UserGlobal'
import TariffGlobal from './store/TariffGlobal'
import ClientGlobal from "./store/SalesmanGlobal";

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserGlobal(),
        tariff: new TariffGlobal(),
        currentClient: new ClientGlobal()
    }}>
        <App/>
    </Context.Provider>,
    document.getElementById('root')
)
