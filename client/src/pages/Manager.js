import React, {useContext, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Button, Col, Container, Form, Modal, Row, Table} from 'react-bootstrap'
import {Context} from '../index'
import {changeTariff, createTariff, deleteTariff, findTariffs, getAllTariffs, getTariff} from '../http/tariffAPI'

const Manager = observer(() => {
    const {tariff} = useContext(Context)
    const [tariffName, setTariffName] = useState('')
    const [subscriptionFee, setSubscriptionFee] = useState()
    const [internetTraffic, setInternetTraffic] = useState()
    const [minutes, setMinutes] = useState()
    const [sms, setSms] = useState()

    const [findTariff, setFindTariff] = useState('')

    const [modalShow, setModalShow] = useState(false)
    const [modalTariff, setModalTariff] = useState({})

    useEffect(() => {
        getAllTariffs().then(data => tariff.setTariffs(data))
    }, [])

    const validate = () => {
        return document.querySelector('.is-invalid') === null
    }

    const create = async () => {
        //console.log(validate())
        if (validate()) {
            try {
                await createTariff(tariffName, subscriptionFee, internetTraffic, minutes, sms)
                alert('Тариф добавлен!')
            } catch (e) {
                alert(e.response.data.message)
            }
        } else alert('Не все поля корректны!')
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
        const [tariffName, setTariffName] = useState(props.tariff.name || '')
        const [subscriptionFee, setSubscriptionFee] = useState(props.tariff.subscription_fee || '')
        const [internetTraffic, setInternetTraffic] = useState(props.tariff.internet_traffic || '')
        const [minutes, setMinutes] = useState(props.tariff.minutes || '')
        const [sms, setSms] = useState(props.tariff.sms || '')

        const change = async () => {
            if (document.querySelector('.modalForm div div div .form-control.is-invalid') === null) {
                try {
                    await changeTariff(props.tariff.name, tariffName, subscriptionFee, internetTraffic, minutes, sms)
                    getAllTariffs()
                        .then(data => {tariff.setTariffs(data)
                            alert('Тариф изменён')})
                } catch (e) {
                    alert(e.response.data.message)
                }
            } else alert('Не все поля корректны!')
        }

        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Изменение тарифа
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="modalForm">
                        <Row className="align-items-start">
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffName">
                                <Form.Text className="text-muted">
                                    Название тарифа
                                </Form.Text>
                                <Form.Control size="lg" type="text" value={tariffName} placeholder="Название тарифа"
                                              onChange={(e) => {
                                                  setTariffName(e.target.value.trimStart())
                                              }}
                                              isInvalid={!(tariffName.length > 0 && tariffName.length <= 64 && tariffName[tariffName.length - 1] !== ' ')}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Название тарифа не может быть пустым, иметь в конце пробельные символы и быть больше, чем 64 символа
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffSubscriptionFee">
                                <Form.Text className="text-muted">
                                    Абонентская плата
                                </Form.Text>
                                <Form.Control type="text" placeholder="Абонентская плата" value={subscriptionFee}
                                              onChange={e => {
                                                  setSubscriptionFee(e.target.value.trim().replace(/ /g, ''))
                                              }}
                                              isInvalid={!(subscriptionFee >= 150 && subscriptionFee <= 5000)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Абонентская плата не может быть ниже 150 и выше 5000
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffInternetTraffic">
                                <Form.Text className="text-muted">
                                    Интернет трафик
                                </Form.Text>
                                <Form.Control type="text" placeholder="Интернет трафик" value={internetTraffic}
                                              onChange={e => {
                                                  setInternetTraffic(e.target.value.trim().replace(/ /g, ''))
                                              }}
                                              isInvalid={!((internetTraffic >= 0 && internetTraffic <= 50 && internetTraffic.length !== 0) || internetTraffic == -1)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Интернет трафик может быть безлимитным (-1) или быть между 0 и 50ГБ
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffMinutes">
                                <Form.Text className="text-muted">
                                    Минуты
                                </Form.Text>
                                <Form.Control type="text" placeholder="Минуты" value={minutes}
                                              onChange={e => {
                                                  setMinutes(e.target.value.trim().replace(/ /g, ''))
                                              }}
                                              isInvalid={!((minutes >= 0 && minutes <= 2000 && minutes.length !== 0 && Number.isInteger(Number(minutes))) || minutes == -1)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Минуты могут быть безлимитными (-1) или быть между 0 и 2000 шт.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formUpdateTariffMinutes">
                                <Form.Text className="text-muted">
                                    SMS
                                </Form.Text>
                                <Form.Control type="number" placeholder="SMS" value={sms}
                                              onChange={e => {
                                                  setSms(e.target.value.trim().replace(/ /g, ''))
                                              }}
                                              isInvalid={!((sms >= 0 && sms <= 2000 && sms.length !== 0 && Number.isInteger(Number(sms))) || sms == -1)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    SMS могут быть безлимитными (-1) или быть между 0 и 2000 шт.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        change().then(data => {
                            if (document.querySelector('.modalForm div div div .form-control.is-invalid') === null) {
                                props.onHide()
                            }
                        })
                    }}>Сохранить изменения</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div>
            <Container style={{marginTop: 30}}>
                <h1 className="mt-4">Панель менеджера</h1>
                <hr/>
            </Container>
            <Container>
                <h2 className="mt-4">Создать тариф</h2>
                <Form noValidate={false} className="mainForm">
                    <div className="d-flex justify-content-around align-items-start">
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formTariffName">
                                <Form.Text className="text-muted">
                                    Название тарифа
                                </Form.Text>
                                <Form.Control aria-label="Default select example" placeholder="Название тарифа"
                                              value={tariffName}
                                              onChange={(e) => {
                                                  setTariffName(e.target.value.trimStart())
                                              }}
                                    isInvalid={!(tariffName.length > 0 && tariffName.length <= 64 && tariffName[tariffName.length - 1] !== ' ')}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Название тарифа не может быть пустым, иметь в конце пробельные символы и быть больше, чем 64 символа
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formSubscriptionFee">
                                <Form.Text className="text-muted">
                                    Абонентская плата
                                </Form.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Абонентская плата"
                                    value={subscriptionFee}
                                    onChange={e => {
                                        setSubscriptionFee(e.target.value.trim().replace(/ /g, ''))
                                    }}
                                    isInvalid={!(subscriptionFee >= 150 && subscriptionFee <= 5000)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Абонентская плата не может быть ниже 150 и выше 5000
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formInternetTraffic">
                                <Form.Text className="text-muted">
                                    Интернет трафик
                                </Form.Text>
                                <Form.Control
                                    value={internetTraffic}
                                    type="text"
                                    onChange={e => {
                                        setInternetTraffic(e.target.value.trim().replace(/ /g, ''))
                                    }}
                                    placeholder="Интернет трафик"
                                    isInvalid={!((internetTraffic >= 0 && internetTraffic <= 50 && internetTraffic.length !== 0) || internetTraffic == -1)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Интернет трафик может быть безлимитным (-1) или быть между 0 и 50ГБ
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formMinutes">
                                <Form.Text className="text-muted">
                                    Минуты
                                </Form.Text>
                                <Form.Control
                                    value={minutes}
                                    type="text"
                                    onChange={e => {
                                        setMinutes(e.target.value.trim().replace(/ /g, ''))
                                    }}
                                    placeholder="Минуты"
                                    isInvalid={!((minutes >= 0 && minutes <= 2000 && minutes.length !== 0 && Number.isInteger(Number(minutes))) || minutes == -1)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Минуты могут быть безлимитными (-1) или быть между 0 и 2000 шт.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={2} style={{padding: '5px'}}>
                            <Form.Group controlId="formSMS">
                                <Form.Text className="text-muted">
                                    SMS
                                </Form.Text>
                                <Form.Control
                                    value={sms}
                                    type="text"
                                    onChange={e => {
                                        setSms(e.target.value.trim().replace(/ /g, ''))
                                    }}
                                    placeholder="SMS"
                                    isInvalid={!((sms >= 0 && sms <= 2000 && sms.length !== 0 && Number.isInteger(Number(sms))) || sms == -1)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    SMS могут быть безлимитными (-1) или быть между 0 и 2000 шт.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </div>
                    <Col md={2} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            type="submit"
                            onClick={create}
                            //disabled={validField}
                        >Добавить</Button>
                    </Col>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Поиск</h2>
                <Form className="d-flex align-items-end">
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formTariffFinder">
                            <Form.Text className="text-muted">
                                Введите название тарифа
                            </Form.Text>
                            <Form.Control value={findTariff} type="text" placeholder="Найти тариф" onChange={(e) => {
                                setFindTariff(e.target.value.trimStart())
                                find(e.target.value.trimStart()).then(data => tariff.setTariffs(data))
                            }}/>
                        </Form.Group>
                    </Col>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Тарифы</h2>
                <Table className="mt-4" hover={true}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Название тарифа</th>
                        <th>Абонентская плата</th>
                        <th>Интернет трафик</th>
                        <th>Минуты</th>
                        <th>SMS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        tariff.tariffs.map((t, index) => {
                                return (
                                    <tr key={t.name}>
                                        <td>{index + 1}</td>
                                        <td>{t.name}</td>
                                        <td>{t.subscription_fee}</td>
                                        <td>{t.internet_traffic === '-1.00' ? 'Безлимит' : t.internet_traffic}</td>
                                        <td>{t.minutes === -1 ? 'Безлимит' : t.minutes}</td>
                                        <td>{t.sms === -1 ? 'Безлимит' : t.sms}</td>
                                        <td>
                                            <Button className="me-4" variant="outline-warning" onClick={() => {
                                                getOneTariff(t.name).then(data => {
                                                    setModalTariff(data)
                                                    setModalShow(true)
                                                })
                                            }}>Изменить</Button>
                                            <Button variant="outline-danger" onClick={() => {
                                                delTariff(t.name)
                                                alert(`Тариф "${t.name}" удалён`)
                                            }}>Удалить</Button>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                    </tbody>
                </Table>
            </Container>
            <MyVerticallyCenteredModal tariff={modalTariff} show={modalShow} onHide={() => setModalShow(false)}/>
        </div>
    )
})

export default Manager
