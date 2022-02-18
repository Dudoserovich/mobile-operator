import React, {useContext, useEffect} from 'react'
import {Container, Table} from 'react-bootstrap'
import {observer} from 'mobx-react-lite'
import {getAllTariffs} from '../http/tariffAPI'
import {Context} from '../index'

const Tariffs = observer(() => {

    const {tariff} = useContext(Context)

    useEffect(() => {
        getAllTariffs()
            .then(data => tariff.setTariffs(data))
    }, [])

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{flexDirection: 'column'}}
        >
            <h1 className="mt-4">Тарифы</h1>
            <Table className="mt-4">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Название тарифа</th>
                    <th>Абонентская плата</th>
                    <th>Интернет траффик</th>
                    <th>Минуты</th>
                    <th>SMS</th>
                </tr>
                </thead>
                <tbody>
                {
                    tariff.tariffs.map((tariff, index) => {
                            return (
                                <tr key={tariff.name}>
                                    <td>{index + 1}</td>
                                    <td>{tariff.name}</td>
                                    <td>{tariff.subscription_fee}</td>
                                    <td>{tariff.internet_traffic === '-1.00' ? 'Безлимит' : tariff.internet_traffic}</td>
                                    <td>{tariff.minutes === -1 ? 'Безлимит' : tariff.minutes}</td>
                                    <td>{tariff.sms === -1 ? 'Безлимит' : tariff.sms}</td>
                                </tr>
                            )
                        }
                    )
                }
                </tbody>
            </Table>
        </Container>
    )
})

export default Tariffs