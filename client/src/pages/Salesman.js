import React, {useContext, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Button, Col, Container, Form, Modal, Table} from 'react-bootstrap'
import {Context} from '../index'
import {allTariffs, createClient, findAllClients, getOneClient} from '../http/salesmanAPI'

const Salesman = observer(() => {
    const {currentClient} = useContext(Context)
    const {tariff} = useContext(Context)
    const [passport, setPassport] = useState('')
    const [fio, setFio] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [regPlace, setRegPlace] = useState('')

    const [findTariff, setFindTariff] = useState('')

    const [modalShow, setModalShow] = useState(false)
    const [modalClient, setModalClient] = useState({})
    const [modalSubscribers, setModalSubscribers] = useState([])

    useEffect(() => {
        getAllTariffs().then(data => {
            tariff.setTariffs(data)
        })
    })

    const getAllTariffs = async () => {
        try {
            return await allTariffs()
        } catch (e) {
            alert(e.response.data.message)
        }
    }

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

    const MyVerticallyCenteredModal = (props) => {
        const [fullName, setFullName] = useState(props.client.full_name)
        const [dateOfBirth, setDateOfBirth] = useState(`${props.client.date_of_birth}`.slice(0, 10))
        const [passport, setPassport] = useState(props.client.passport)
        const [account, setAccount] = useState('')
        // const [sms, setSms] = useState(props.client.sms)

        const accountGeneration = () => {
            let account = ''
            for (let i = 0; i < 20; i++) {
                account += Math.floor(Math.random() * 10)
            }
            return account
        }

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
                        Изменение клиента
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
                    </Form>
                    <hr/>
                    <h4>Добавить абонента</h4>
                    <Form>
                        <Col md={12} style={{padding: '5px'}}>
                            <Form.Group controlId="formSubscriber">
                                <Form.Text className="text-muted">
                                    Аккаунт
                                </Form.Text>
                                <Form.Control disabled type="number" placeholder="Аккаунт" value={account}
                                              onChange={(e) => setPassport(e.target.value)}/>
                            </Form.Group>
                            <Button style={{marginTop: 10}} variant="outline-success" onClick={() => {
                                setAccount(accountGeneration())
                            }}>Сгенерировать аккаунт</Button>
                        </Col>
                        <Col md={12} style={{padding: '5px'}}>
                            <Form.Group controlId="formSubscriberTariff">
                                <Form.Text className="text-muted">
                                    Тариф
                                </Form.Text>
                                <Form.Select
                                    aria-label="Default select example"
                                >
                                    {
                                        tariff.tariffs.map((tariff) => {
                                            return (
                                                <option
                                                    value={tariff.name}>{tariff.name} (Плата: {tariff.subscription_fee},
                                                    Интернет: {tariff.internet_traffic === '-1.00' ? 'Безлимит' : tariff.internet_traffic},
                                                    Минуты: {tariff.minutes === -1 ? 'Безлимит' : tariff.minutes},
                                                    СМС: {tariff.sms === -1 ? 'Безлимит' : tariff.sms})</option>
                                            )
                                        })
                                    }
                                </Form.Select>
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
                        <th>Место регистрации</th>
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
                                                <Button
                                                    className="me-4"
                                                    variant="outline-warning"
                                                    onClick={() => {
                                                        setModalClient(currentClient.clients[0])
                                                        setModalShow(true)
                                                    }}
                                                >Изменить</Button>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                            : <tr>
                                <td>Нет совпадений</td>
                            </tr>
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
                                create().then(data => {
                                    alert(data.message)
                                })
                            }}>Добавить</Button>
                    </Col>
                </Form>
            </Container>
            <MyVerticallyCenteredModal
                client={modalClient}
                show={modalShow}
                onHide={() => setModalShow(false)}/>
        </div>
    )
})

export default Salesman
