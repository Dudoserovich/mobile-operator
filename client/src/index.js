import React, {createContext} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import UserGlobal from './store/UserGlobal'
import TariffGlobal from './store/TariffGlobal'
import ClientGlobal from "./store/SalesmanGlobal";
import Phones from "./store/PhonesGlobal";
import subscriberGlobal from "./store/SubscriberGlobal";

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserGlobal(),
        tariff: new TariffGlobal(),
        currentClient: new ClientGlobal(),
        currentPhones: new Phones(),
        currentSub: new subscriberGlobal()
    }}>
        <App/>
    </Context.Provider>,
    document.getElementById('root')
)
