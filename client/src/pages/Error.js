import React from 'react';
import {observer} from 'mobx-react-lite'

const Error = observer(() => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            Error page
        </div>
    )
})

export default Error