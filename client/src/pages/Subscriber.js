import React from 'react'
import {observer} from 'mobx-react-lite'

const Subscriber = observer(() => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            Subscriber
        </div>
    )
})

export default Subscriber