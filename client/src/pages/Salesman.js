import React, {useContext, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Button, Col, Container, Form, Modal, Row, Table} from 'react-bootstrap'
import {Context} from '../index'
import {
    allTariffs,
    changeClient,
    createClient,
    findAllClients,
    getOneClient,
    findAllPhones,
    findAllSub, createNewSub,
    deleteSub
} from '../http/salesmanAPI'
import InputMask from 'react-input-mask'

const Salesman = observer(() => {
    const {currentClient} = useContext(Context)
    /*const {tariff} = useContext(Context)*/
    const {currentPhones} = useContext(Context)

    const [passport, setPassport] = useState('')
    const [fio, setFio] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [regPlace, setRegPlace] = useState('')
    const [account, setAccount] = useState('')
    const [tel, setTel] = useState('')

    const [findTariff, setFindTariff] = useState('')

    const [modalShow, setModalShow] = useState(false)
    const [modalClient, setModalClient] = useState({})

    const [modalNumShow, setModalNumShow] = useState(false)

    const [modalSubscribers, setModalSubscribers] = useState([])

    useEffect(() => {
        /*getAllTariffs().then(data => {
            tariff.setTariffs(data)
        })*/
        findAllPhones("").then((data) => {
            currentPhones.setPhones(data)
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

    const createSub = async () => {
        if (!document.querySelector('.newSub div div .form-control.is-invalid')) {
            try {
                //console.log(currentClient.clients)
                await createNewSub(passport, fio || currentClient.clients[0].full_name,
                    birthDate || currentClient.clients[0].date_of_birth,
                    regPlace || currentClient.clients[0].reg, account,
                    tel.replace(/[ \-\(\)_]/g, '').replace(/^\+7/, '')).then(() => {
                    alert('Абонент добавлен')
                    findAllSubs(passport)
                })
            } catch (e) {
                alert(e.response.data.message)
            }
        } else {
            alert('Не все поля корректны!')
        }
    }

    const findAll = async (passport) => {
        try {
            return await findAllClients(passport)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const findAllSubs = async (passport) => {
        try {
            return await findAllSub(passport)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const delSub = async (account) => {
        try {
            console.log(account)
            return await deleteSub(account)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    function capitalize(str) {

        return str.replace(/(^|\s)\S/g, function (a) {
            return a.toUpperCase()
        })

    }

    const yearOld = () => {
        let birth_date = birthDate.split('-')
        let dob = new Date(Number(birth_date[0]), Number(birth_date[1] - 1), Number(birth_date[2]))
        return (new Date().getTime() - dob) / (24 * 3600 * 365.25 * 1000) | 0
    }

    const ModalNumbers = (props) => {
        const [phone, setPhone] = useState(tel)
        const [phones, setPhones] = useState(currentPhones.phones)

        const chooseNum = async (num) => {
            try {
                return await findAllPhones(num)
            } catch (e) {
                alert(e.response.data.message)
            }
        }
        //console.log("modalNumber")
        return (
            <Modal {...props} size="" aria-labelledby="contained-modal-title-vcenter" centered scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Список доступных номеров
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="">
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formFIO" style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Form.Text className="text-muted">
                                    Поиск
                                </Form.Text>
                                <InputMask mask="+7 (999) 999-99-99" type="text" placeholder="+7 (999) 999-99-99"
                                           value={phone}
                                           onChange={(e) => {
                                               // тут должна быть функция поиска
                                               const numWithoutMask = e.target.value.replace(/[ \-\(\)_]/g, '').replace(/^\+7/, '')
                                               chooseNum(numWithoutMask).then((data) => {
                                                   currentPhones.setPhones(data)
                                                   //console.log(currentPhones.phones)
                                                   setPhones(currentPhones.phones)
                                               })
                                               //console.log(e.target.value.replace(/[ \-\(\)_]/g, '').replace(/^\+7/, ''))
                                               setPhone(numWithoutMask)
                                               /*setTel(e.target.value)*/
                                           }}>
                                </InputMask>
                            </Form.Group>
                        </Col>
                        {
                            phones.length ?
                                phones.map((p) => {
                                        return (
                                            <Row style={{padding: '2px', alignItems: "start"}}>
                                                <hr style={{margin: "0.4rem 0"}}/>
                                                <Col style={{marginTop: "auto", marginBottom: "auto"}}>
                                                    {"+7 (" + p.phone_number[0] + p.phone_number[1] +
                                                    p.phone_number[2] + ") " + p.phone_number[3] +
                                                    p.phone_number[4] + p.phone_number[5] + '-' +
                                                    p.phone_number[6] + p.phone_number[7] + '-' +
                                                    p.phone_number[8] + p.phone_number[9]}
                                                </Col>
                                                <Col style={{marginTop: "auto", marginBottom: "auto"}}>
                                                    <Button
                                                        onClick={() => {
                                                            setTel("+7 (" + p.phone_number[0] + p.phone_number[1] +
                                                                p.phone_number[2] + ") " + p.phone_number[3] +
                                                                p.phone_number[4] + p.phone_number[5] + '-' +
                                                                p.phone_number[6] + p.phone_number[7] + '-' +
                                                                p.phone_number[8] + p.phone_number[9])
                                                            props.onHide()
                                                        }}
                                                    >Выбрать номер</Button>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                )
                                : <>
                                    <hr style={{margin: "0.4rem 0"}}/>
                                    "Нет совпадений"
                                </>
                        }
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    const MyVerticallyCenteredModal = (props) => {
        const [fullName, setFullName] = useState(props.client.full_name || '')
        const [dateOfBirth, setDateOfBirth] = useState(`${props.client.date_of_birth}`.slice(0, 10) || '')
        const [passport, setPass] = useState(props.client.passport || '')
        const [registrationPlace, setRegPlace] = useState(props.client.reg || '')
        const [account, setAccount] = useState('')
        /*        console.log("Chlen")
                console.log(props.client)*/

        const change = async () => {
            if (document.querySelector('.modalForm div div .form-control.is-invalid') === null) {
                try {
                    await changeClient(props.client.passport, passport, fullName, dateOfBirth, registrationPlace, props.client.reg)
                    findAll(passport)
                        .then(data => {
                            currentClient.setClients(data)
                            alert('Клиент изменён')
                            // меняем паспорт в поиске
                            setPassport(passport)
                        })
                } catch (e) {
                    alert(e.response.data.message)
                }
            } else alert('Не все поля корректны!')
        }

        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Изменение клиента
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="modalForm">
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formClientPassport">
                                <Form.Text className="text-muted">
                                    Серия и номер паспорта
                                </Form.Text>
                                <Form.Control type="text" placeholder="Серия и номер паспорта" value={passport}
                                              onChange={(e) => setPass(e.target.value.replace(/ /g, ''))}
                                              isInvalid={!(passport.length > 0 && passport > 100000101 && passport <= 9999999999)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Значение серии и номера паспорта должно быть между 100000101 и 9999999999
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={12} style={{padding: '5px'}}>
                            <Form.Group controlId="formClientFullName">
                                <Form.Text className="text-muted">
                                    ФИО
                                </Form.Text>
                                <Form.Control size="lg" type="text" value={fullName} placeholder="ФИО"
                                              onChange={(e) => setFullName(capitalize(e.target.value.replace(/[^А-я ]/, '').replaceAll("  ", " ").trimStart()))}
                                              isInvalid={!(fullName.length >= 2 && fullName.length <= 255 && fullName[fullName.length - 1] !== ' ')}
                                />
                                <Form.Control.Feedback type="invalid">
                                    ФИО должно содержать от 2 до 255 символов, не может быть пустым,
                                    не может заканчиваться пробельными символами.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formClientBirth">
                                <Form.Text className="text-muted">
                                    Дата рождения
                                </Form.Text>
                                <Form.Control type="date" placeholder="Дата рождения" value={dateOfBirth}
                                              disabled={true}
                                              onChange={(e) => setDateOfBirth(e.target.value)}/>
                            </Form.Group>
                        </Col>
                        <Col md={4} style={{padding: '5px'}}>
                            <Form.Group controlId="formRegPlace">
                                <Form.Text className="text-muted">
                                    Место регистрации
                                </Form.Text>
                                <Form.Control type="text" placeholder="Место регистрации" value={registrationPlace}
                                              onChange={(e) => setRegPlace(
                                                  e.target.value.replace(/^[0-9]*[^А-я]/, '')
                                                      .replace(/[^А-я0-9 \-,./]/, '')
                                                      .replaceAll("  ", " ")
                                                      .trimStart())
                                              }
                                              isInvalid={!(registrationPlace.length >= 2 && registrationPlace.length <= 255 &&
                                                  "-,./".indexOf(registrationPlace[registrationPlace.length - 1]) === -1)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Место прописки должно содержать от 2 до 255 символов, не может быть пустым,
                                    не может заканчиваться пробельными символами и специальными символами ('-', ',',
                                    '.', '/')
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        change().then(data => {
                            if (document.querySelector('.modalForm div div .form-control.is-invalid') === null) {
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
                <h1 className="mt-4">Панель продавца-консультанта</h1>
                <hr/>
            </Container>
            <Container>
                <h2 className="mt-4">Проверка актуальности данных клиента</h2>
                <Form className="d-flex align-items-end">
                    <Col md={3} style={{padding: '5px'}}>
                        <Form.Group controlId="formPassportFinder">
                            <Form.Text className="text-muted">
                                Серия и номер паспорта
                            </Form.Text>
                            <Form.Control
                                value={passport}
                                type="text-muted"
                                placeholder="Серия и номер паспорта"
                                onChange={e => {
                                    findAll(e.target.value).then(data => {
                                        console.log(data)
                                        currentClient.setClients(data)
                                        findAllSubs(e.target.value).then(data1 => {
                                            console.log(data1)
                                            currentClient.setSubscribers(data1)
                                        })
                                    })
                                    setPassport(e.target.value.replace(/ /g, ''))
                                }}
                                isInvalid={!(passport.length > 0 && passport > 100000101 && passport <= 9999999999)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Значение серии и номера паспорта должно быть между 100000101 и 9999999999
                            </Form.Control.Feedback>
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
                <h2 className="mt-4">Добавление абонента</h2>
                <Form className="newSub">
                    <Col md={3} style={{padding: '5px'}}>
                        <Form.Group controlId="formPassport">
                            <Form.Text className="text-muted">
                                Серия и номер паспорта
                            </Form.Text>
                            <Form.Control
                                type="text"
                                placeholder="Серия и номер паспорта"
                                value={passport}
                                onChange={e => {
                                    setPassport(e.target.value.replace(/ /g, ''))
                                    findAll(e.target.value.replace(/ /g, '')).then(data => {
                                        console.log(data)
                                        currentClient.setClients(data)
                                        findAllSubs(e.target.value).then(data1 => {
                                            console.log(data1)
                                            currentClient.setSubscribers(data1)
                                        })
                                    })
                                }}
                                isInvalid={!(passport.length > 0 && passport > 100000101 && passport <= 9999999999)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Значение серии и номера паспорта должно быть между 100000101 и 9999999999
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} style={{padding: '5px'}}>
                        <Form.Group controlId="formFIO">
                            <Form.Text className="text-muted">
                                ФИО
                            </Form.Text>
                            <Form.Control
                                type="text"
                                placeholder="ФИО"
                                disabled={currentClient.clients[0]}
                                value={!currentClient.clients[0] ? fio : currentClient.clients[0].full_name}
                                onChange={(e) =>
                                    setFio(capitalize(e.target.value.replace(/[^А-я ]/, '')
                                        .replaceAll("  ", " ").trimStart()))
                                }
                                isInvalid={!(fio.length >= 2 && fio.length <= 255 && fio[fio.length - 1] !== ' ') && !currentClient.clients[0]}
                            />
                            <Form.Control.Feedback type="invalid">
                                ФИО должно содержать от 2 до 255 символов, не может быть пустым,
                                не может заканчиваться пробельными символами.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={3} style={{padding: '5px'}}>
                        <Form.Group controlId="formBirthData">
                            <Form.Text className="text-muted">
                                Дата рождения
                            </Form.Text>
                            <Form.Control
                                value={!currentClient.clients[0] ? birthDate : currentClient.clients[0].date_of_birth.slice(0, 10)}
                                type="date"
                                disabled={currentClient.clients[0]}
                                placeholder="Дата рождения"
                                onChange={e => setBirthDate(e.target.value)}
                                isInvalid={!(birthDate.length > 0 && yearOld() >= 18) && !currentClient.clients[0]}
                            />
                            <Form.Control.Feedback type="invalid">
                                Дата рождения не может быть пустой и клиенту должно быть >=18 лет
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegPlace">
                            <Form.Text className="text-muted">
                                Место регистрации
                            </Form.Text>
                            <Form.Control
                                value={!currentClient.clients[0] ? regPlace : currentClient.clients[0].reg}
                                type="text"
                                disabled={currentClient.clients[0]}
                                placeholder="Место регистрации"
                                onChange={(e) => setRegPlace(
                                    e.target.value.replace(/^[0-9]*[^А-я]/, '')
                                        .replace(/[^А-я0-9 \-,./]/, '')
                                        .replaceAll("  ", " ")
                                        .trimStart())
                                }
                                isInvalid={!(regPlace.length >= 2 && regPlace.length <= 255 &&
                                    "-,./".indexOf(regPlace[regPlace.length - 1]) === -1) && !currentClient.clients[0]}
                            />
                            <Form.Control.Feedback type="invalid">
                                Место прописки должно содержать от 2 до 255 символов, не может быть пустым,
                                не может заканчиваться пробельными символами и специальными символами ('-', ',', '.',
                                '/')
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={3} style={{padding: '5px'}}>
                        <Form.Group controlId="formAccountSubscriber">
                            <Form.Text className="text-muted">
                                Абонентский счёт
                            </Form.Text>
                            <Form.Control
                                value={account}
                                type="text"
                                placeholder="Абонентский счёт"
                                onChange={e => setAccount(e.target.value.trim().replace(/[^0-9]/, ''))}
                                isInvalid={!(account.length === 20)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Абонентский счёт должен содержать ровно 20 цифр
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Row md={3} style={{padding: '5px'}} className="align-items-end">
                        <Col>
                            <Form.Group controlId="formAccountSubscriber">
                                <Form.Text className="text-muted">
                                    Телефонный номер
                                </Form.Text>
                                <Form.Control
                                    value={tel}
                                    type="tel"
                                    disabled={true}
                                    /*onChange={e => setTel(e.target.value)}*/
                                    placeholder="Телефонный номер"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Button
                                variant="outline-success"
                                style={{marginTop: 0, marginBottom: 0}}
                                onClick={() => {
                                    setModalNumShow(true)
                                }}>Добавить номер</Button>
                        </Col>
                    </Row>
                    <Col md={2} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            onClick={() => {
                                createSub().then(() => {
                                    findAllSubs(passport).then((data) => {
                                        currentClient.setSubscribers(data)
                                        setTel('')
                                        setAccount('')
                                    })
                                })
                            }}>Добавить абонента</Button>
                    </Col>
                </Form>
                <h2>Абоненты клиента</h2>
                <Table className="mt-4" hover={true}>
                    <thead>
                    <tr>
                        <th>Абонентский счёт</th>
                        {/*<th>Баланс</th>
                        <th>Тариф</th>
                        <th>Паспорт клиента</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        currentClient.subscribers.length ?
                            currentClient.subscribers.map((subscriber) => {
                                    return (
                                        <tr key={subscriber.account}>
                                            <td>{subscriber.account}</td>
                                            {/*<td>{subscriber.balance}</td>
                                            <td>{subscriber.tariffName}</td>
                                            <td>{subscriber.clientPassport}</td>*/}
                                            <td>
                                                <Button
                                                    className="me-4"
                                                    variant="outline-warning"
                                                    onClick={() => {
                                                        delSub(subscriber.account).then((data1) => {
                                                            alert(data1.message)
                                                            findAllSubs(passport).then((data2) => {
                                                                currentClient.setSubscribers(data2)
                                                            })
                                                        })
                                                    }}
                                                >Удалить</Button>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                            : <tr>
                                <td>У клиента ещё нет абонентов</td>
                            </tr>
                    }
                    </tbody>
                </Table>
            </Container>
            <MyVerticallyCenteredModal
                client={modalClient}
                show={modalShow}
                onHide={() => setModalShow(false)}/>
            <ModalNumbers
                show={modalNumShow}
                onHide={() => setModalNumShow(false)}/>
        </div>
    )
})

export default Salesman
