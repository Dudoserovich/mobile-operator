import React, {useContext, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Button, Col, Container, Form, Modal, Table} from 'react-bootstrap'
import {Context} from '../index'
import {createClient, findAllClients, getOneClient} from '../http/salesmanAPI'

const Salesman = observer(() => {
    const {currentClient} = useContext(Context)
    const [passport, setPassport] = useState('')
    const [fio, setFio] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [regPlace, setRegPlace] = useState('')

    const [findTariff, setFindTariff] = useState('')

    const [modalShow, setModalShow] = useState(false)
    const [modalClient, setModalClient] = useState({})
    const [modalSubscribers, setModalSubscribers] = useState([])

    // useEffect(() => {
    //     findAll(passport).then(data => {
    //         if (data) {
    //             currentClient.setClients(data)
    //         }
    //     })
    // }, [])

    const create = async () => {
        try {
            return await createClient(passport, fio, birthDate, regPlace)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const findAll = async (passport) => {
        try {
            return await findAllClients(passport)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const find = async () => {
        try {
            return await getOneClient(passport)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    // const delTariff = async (name) => {
    //     try {
    //         await deleteTariff(name)
    //         getAllTariffs().then(data => tariff.setTariffs(data))
    //     } catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    // const getOneTariff = async (name) => {
    //     try {
    //         return await getTariff(name)
    //     } catch (e) {
    //         alert(e.response.data.message)
    //     }
    // }

    const MyVerticallyCenteredModal = (props) => {
        const [fullName, setFullName] = useState(props.client.full_name)
        const [dateOfBirth, setDateOfBirth] = useState(`${props.client.date_of_birth}`.slice(0, 10))
        const [passport, setPassport] = useState(props.client.passport)
        // const [minutes, setMinutes] = useState(props.client.minutes)
        // const [sms, setSms] = useState(props.client.sms)

        const change = async () => {
            try {
                // await changeTariff(props.tariff.name, tariffName, subscriptionFee, internetTraffic, minutes, sms)
                // getAllTariffs()
                //     .then(data => tariff.setTariffs(data))
            } catch (e) {
                alert(e.response.data.message)
            }
        }

        const setTable = () => {
            if (currentClient.subscribers.length) {
                currentClient.subscribers.map((sub, index) => {
                        return (
                            <tr key={sub.account}>
                                <td>{index + 1}</td>
                                <td>{sub.account}</td>
                                <td>{sub.balance}</td>
                                <td>{sub.tariffName}</td>
                                <td>
                                    <Button className="me-4" variant="outline-warning"
                                    >Изменить</Button>
                                    <Button variant="outline-danger">Удалить</Button>
                                </td>
                            </tr>
                        )
                    }
                )
            } else {
                return 'Нет абонентов'
            }
        }

        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Изменение тарифа
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formClientPassport">
                                <Form.Text className="text-muted">
                                    Серия и номер паспорта
                                </Form.Text>
                                <Form.Control type="number" placeholder="Серия и номер паспорта" value={passport}
                                              onChange={(e) => setPassport(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col md={12} style={{padding: '5px'}}>
                            <Form.Group controlId="formClientFullName">
                                <Form.Text className="text-muted">
                                    ФИО
                                </Form.Text>
                                <Form.Control size="lg" type="text" value={fullName} placeholder="ФИО"
                                              onChange={(e) => setFullName(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formClientBirth">
                                <Form.Text className="text-muted">
                                    Дата рождения
                                </Form.Text>
                                <Form.Control type="date" placeholder="Дата рождения" value={dateOfBirth}
                                              onChange={(e) => setDateOfBirth(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Button variant="outline-success">Добавить абонента</Button>
                    </Form>
                    {
                        setTable()
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        change().then(data => {
                            props.onHide()
                        })
                    }}>Сохранить изменения</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div>
            <Container style={{marginTop: 30}}>
                <h1 className="mt-4">Панель продавца-консультанта</h1>
                <hr/>
            </Container>
            <Container>
                <h2 className="mt-4">Проверка совпадений</h2>
                <Form className="d-flex align-items-end">
                    <Col md={2} style={{padding: '5px'}}>
                        <Form.Group controlId="formPassportFinder">
                            <Form.Text className="text-muted">
                                Серия и номер паспорта
                            </Form.Text>
                            <Form.Control
                                value={passport}
                                type="text"
                                placeholder="Серия и номер паспорта"
                                onChange={e => {
                                    findAll(e.target.value).then(data => {
                                        console.log(data)
                                        currentClient.setClients(data)
                                    })
                                    setPassport(e.target.value)
                                }}/>
                        </Form.Group>
                    </Col>
                </Form>
                <Table className="mt-4" hover={true}>
                    <thead>
                    <tr>
                        <th>Паспортные данные</th>
                        <th>ФИО</th>
                        <th>Дата рождения</th>
                        <th>Должность</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        currentClient.clients.length ?
                            currentClient.clients.map((client, index) => {
                                    return (
                                        <tr key={client.passport}>
                                            <td>{client.passport}</td>
                                            <td>{client.full_name}</td>
                                            <td>{new Date(client.date_of_birth).toLocaleDateString()}</td>
                                            <td>{client.reg}</td>
                                            <td>
                                                <Button className="me-4" variant="outline-warning"
                                                >Изменить</Button>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                            : <tr><td>Нет совпадений</td></tr>
                    }
                    </tbody>
                </Table>
            </Container>
            <Container>
                <h2 className="mt-4">Добавить нового клиента</h2>
                <Form>
                    <Col md={2} style={{padding: '5px'}}>
                        <Form.Group controlId="formPassport">
                            <Form.Text className="text-muted">
                                Серия и номер паспорта
                            </Form.Text>
                            <Form.Control
                                type="number"
                                placeholder="Серия и номер паспорта"
                                value={passport}
                                onChange={e => setPassport(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col md={6} style={{padding: '5px'}}>
                        <Form.Group controlId="formSubscriptionFee">
                            <Form.Text className="text-muted">
                                ФИО
                            </Form.Text>
                            <Form.Control
                                type="text"
                                placeholder="ФИО"
                                value={fio}
                                onChange={e => setFio(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col md={2} style={{padding: '5px'}}>
                        <Form.Group controlId="formBirthData">
                            <Form.Text className="text-muted">
                                Дата рождения
                            </Form.Text>
                            <Form.Control
                                value={birthDate}
                                type="date"
                                onChange={e => setBirthDate(e.target.value)}
                                placeholder="Дата рождения"/>
                        </Form.Group>
                    </Col>
                    <Col md={6} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegPlace">
                            <Form.Text className="text-muted">
                                Место регистрации
                            </Form.Text>
                            <Form.Control
                                value={regPlace}
                                type="text"
                                onChange={e => setRegPlace(e.target.value)}
                                placeholder="Место регистрации"/>
                        </Form.Group>
                    </Col>
                    <Col md={2} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            onClick={() => {
                                console.log(birthDate)
                                create()
                                    .then(data => {
                                        alert(data.message)
                                    })
                            }}>Добавить</Button>
                    </Col>
                </Form>
            </Container>
            <MyVerticallyCenteredModal
                client={modalClient}
                subscribers={modalSubscribers}
                show={modalShow}
                onHide={() => setModalShow(false)}/>
        </div>
    )
})

export default Salesman
