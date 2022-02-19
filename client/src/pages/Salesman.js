import React, {useContext, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Button, Col, Container, Form, Modal, Table} from 'react-bootstrap'
import {Context} from '../index'
import {changeTariff, createTariff, deleteTariff, findTariffs, getAllTariffs, getTariff} from '../http/tariffAPI'

const Salesman = observer(() => {
    const {tariff} = useContext(Context)
    const [passport, setPassport] = useState('')
    const [fio, setFio] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [regPlace, setRegPlace] = useState('')

    const [findTariff, setFindTariff] = useState('')

    const [modalShow, setModalShow] = useState(false)
    const [modalTariff, setModalTariff] = useState({})

    useEffect(() => {
        getAllTariffs().then(data => tariff.setTariffs(data))
    }, [])

    const create = async () => {
        try {
            await createTariff(passport, fio, birthDate)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const find = async (tariffName) => {
        try {
            return await findTariffs(tariffName)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const delTariff = async (name) => {
        try {
            await deleteTariff(name)
            getAllTariffs().then(data => tariff.setTariffs(data))
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const getOneTariff = async (name) => {
        try {
            return await getTariff(name)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const MyVerticallyCenteredModal = (props) => {
        const [tariffName, setTariffName] = useState(props.tariff.name)
        const [subscriptionFee, setSubscriptionFee] = useState(props.tariff.subscription_fee)
        const [internetTraffic, setInternetTraffic] = useState(props.tariff.internet_traffic)
        const [minutes, setMinutes] = useState(props.tariff.minutes)
        const [sms, setSms] = useState(props.tariff.sms)

        const change = async () => {
            try {
                await changeTariff(props.tariff.name, tariffName, subscriptionFee, internetTraffic, minutes, sms)
                getAllTariffs()
                    .then(data => tariff.setTariffs(data))
            } catch (e) {
                alert(e.response.data.message)
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
                    <Form className="">
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffName">
                                <Form.Text className="text-muted">
                                    Название тарифа
                                </Form.Text>
                                <Form.Control size="lg" type="text" value={tariffName} placeholder="Название тарифа"
                                              onChange={(e) => setTariffName(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffSubscriptionFee">
                                <Form.Text className="text-muted">
                                    Абонентская плата
                                </Form.Text>
                                <Form.Control type="number" placeholder="Абонентская плата" value={subscriptionFee}
                                              onChange={(e) => setSubscriptionFee(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffInternetTraffic">
                                <Form.Text className="text-muted">
                                    Интернет траффик
                                </Form.Text>
                                <Form.Control type="number" placeholder="Интернет траффик" value={internetTraffic}
                                              onChange={(e) => setInternetTraffic(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffMinutes">
                                <Form.Text className="text-muted">
                                    Минуты
                                </Form.Text>
                                <Form.Control type="number" placeholder="Минуты" value={minutes}
                                              onChange={(e) => setMinutes(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffMinutes">
                                <Form.Text className="text-muted">
                                    SMS
                                </Form.Text>
                                <Form.Control type="number" placeholder="SMS" value={sms}
                                              onChange={(e) => setSms(e.target.value)}/>
                            </Form.Group>
                        </Col>
                    </Form>
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
                <h2 className="mt-4">Поиск</h2>
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
                                onChange={e => setPassport(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col md={3} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            type="submit"
                            onClick={create}>Найти совпадения</Button>
                    </Col>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Клиенты</h2>
                <Table className="mt-4" hover={true}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Серия и номер паспорта</th>
                        <th>ФИО</th>
                        <th>дата рождения</th>
                        <th>Место регистрации</th>
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
                                    <td>
                                        <Button
                                            className="me-4"
                                            variant="outline-warning"
                                            onClick={() => {
                                                getOneTariff(tariff.name).then(data => {
                                                    setModalTariff(data)
                                                    setModalShow(true)
                                                })
                                            }}>Изменить</Button>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                delTariff(tariff.name)
                                            }}>Удалить</Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Container>
            <Container>
                <h2 className="mt-4">Добавить нового клиента</h2>
                <Form>
                    <div className="">
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formPassport">
                                <Form.Text className="text-muted">
                                    Серия и номер паспорта
                                </Form.Text>
                                <Form.Control
                                    type="text"
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
                                    type="text"
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
                    </div>
                    <Col md={2} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            type="submit"
                            onClick={create}>Добавить</Button>
                    </Col>
                </Form>
            </Container>
            <MyVerticallyCenteredModal
                tariff={modalTariff}
                show={modalShow}
                onHide={() => setModalShow(false)}/>
        </div>
    )
})

export default Salesman
