import React, {useContext, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Button, Col, Container, Form, Modal, Row, Table} from "react-bootstrap";
import {Context} from "../index";
import {changePassword, changeTariff, getSubInfo, refilBal} from "../http/subscriberAPI";
import {allTariffs} from "../http/salesmanAPI";

const Subscriber = observer(() => {
    const {user, currentSub, tariff} = useContext(Context)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [balance, setBalance] = useState('')
    const [newTariff, setNewTariff] = useState('')

    const [modalTariffShow, setModalTariffShow] = useState(false)
    //console.log(user)

    useEffect(() => {
        // получение
        getSubInfo(user.login)
            .then(data => {
                currentSub.setSubInfo(data)
                console.log(data)
            })

        getAllTariffs("").then(data => {
            tariff.setTariffs(data)
        })
    }, [])

    const getAllTariffs = async (name) => {
        try {
            return await allTariffs(name)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const changePass = async (login, pass) => {
        /*if (!document.querySelector('#newPass div div .form-control.is-invalid')) {*/
        if (password.length >= 2 && password.length <= 32) {
            try {
                return await changePassword(login, pass)
            } catch (e) {
                alert(e.response.data.message)
            }
        } else {
            alert('Новый пароль должен содержать от 2 до 32 символов')
        }
    }

    const refilBalance = async (phone_number, filBalance) => {
        console.log(currentSub.subInfo.balance)
        /*if (!document.querySelector('#newPass div div .form-control.is-invalid')) {*/
        if (parseFloat(filBalance) > 0 && parseFloat(filBalance) <= (999999.00 - parseFloat(currentSub.subInfo.balance))) {
            try {
                //alert(parseFloat(filBalance))
                return await refilBal(phone_number, parseFloat(filBalance))
            } catch (e) {
                alert(e.response.data.message)
            }
        } else {
            alert('Пополнение баланса на данную сумму невозможно' +
                '(сумма должна быть больше нуля и меньше или равна ' +
                `${999999.00 - parseFloat(currentSub.subInfo.balance)} руб.`)
        }
    }

    const ModalTariff = (props) => {
        const [selectNewTariff, setSelectNewTariff] = useState(newTariff || '')
        const [allTariffs, setAllTariffs] = useState(tariff.tariffs || '')

        const changeTar = async (tar) => {
            try {
                return await changeTariff(user.login, tar)
            } catch (e) {
                alert(e.response.data.message)
            }
        }

        //console.log("modalNumber")
        return (
            <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Тарифы
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
                                <Form.Control type="text" placeholder="Введите название тарифа"
                                           value={selectNewTariff}
                                           onChange={(e) => {
                                               getAllTariffs(e.target.value).then(data => {
                                                   tariff.setTariffs(data)
                                                   setAllTariffs(tariff.tariffs)
                                               })
                                               setSelectNewTariff(e.target.value)
                                           }}
                                    /* isInvalid={!(passport.length > 0 && passport > 100000101 && passport <= 9999999999)}*/
                                />
                                <Form.Control.Feedback type="invalid">
                                    Значение серии и номера паспорта должно быть между 100000101 и 9999999999
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Table className="mt-4" hover={true}>
                            <thead>
                            <tr>
                                <th> </th>
                                <th>Абонентская плата</th>
                                <th>Минуты</th>
                                <th>SMS</th>
                                <th>Интернет трафик</th>
                            </tr>
                            </thead>
                            <tbody>
                        {
                            allTariffs.length ?
                                allTariffs.map((t) => {
                                        return (
                                            <tr key={t.name}>
                                                <td>{t.name}</td>
                                                <td>{t.subscription_fee} руб.</td>
                                                <td>{t.minutes === -1 ? "Безлимит" : t.minutes}</td>
                                                <td>{t.sms === -1 ? "Безлимит" : t.sms}</td>
                                                <td>{t.internet_traffic == -1.00 ? "Безлимит" : t.internet_traffic}</td>
                                                <td>
                                                    <Button
                                                        onClick={() => {
                                                            setNewTariff(t.name)
                                                            changeTar(t.name).then(() => {
                                                                getSubInfo(user.login)
                                                                    .then(data => {
                                                                        currentSub.setSubInfo(data)
                                                                        setNewTariff('')
                                                                        //console.log(data)
                                                                    })
                                                            })
                                                            //console.log(currentSub.subInfo.tariffName)
                                                            props.onHide()
                                                        }}
                                                        disabled={currentSub.subInfo.balance < t.subscription_fee
                                                        || currentSub.subInfo.tariffName === t.name}
                                                    >{currentSub.subInfo.tariffName === t.name ?
                                                        "Ваш тариф" :
                                                        currentSub.subInfo.balance < t.subscription_fee ?
                                                            "Не хватает суммы" :
                                                            "Выбрать"}
                                                    </Button>
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
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

    return (
        <div>
            <Container style={{marginTop: 30}}>
                <h1 className="mt-4">Панель абонента</h1>
                <hr/>
                <Row>
                    <Col><strong>{currentSub.subInfo.full_name}</strong></Col>
                    <Col><strong>+7 ({currentSub.subInfo.phone_number ?
                        currentSub.subInfo.phone_number[0] +
                    currentSub.subInfo.phone_number[1] +
                    currentSub.subInfo.phone_number[2] + ") " +
                    currentSub.subInfo.phone_number[3] +
                    currentSub.subInfo.phone_number[4] +
                    currentSub.subInfo.phone_number[5] + '-' +
                    currentSub.subInfo.phone_number[6] +
                    currentSub.subInfo.phone_number[7] + '-' +
                    currentSub.subInfo.phone_number[8] +
                    currentSub.subInfo.phone_number[9]
                        : ''
                    }
                    </strong>
                    </Col>
                </Row>
                <Row>
                    <Col>Текущий тариф: <strong>
                        {currentSub.subInfo.tariffName ?
                            currentSub.subInfo.tariffName :
                            "отсутствует"}
                    </strong></Col>
                    <Col>На счету: <strong>
                        {currentSub.subInfo.balance ?
                            currentSub.subInfo.balance.replace(/[\.]/, ",")
                        : ""} руб.
                    </strong>
                    </Col>
                </Row>
                <hr/>
            </Container>
            <Container>
                <h2 className="mt-4">Изменить пароль</h2>
                <Form id="newPass" className="d-flex align-items-end">
                    <Col md={4} style={{padding: '5px'}}>
                        <Form.Group controlId="formPassportFinder">
                            <Form.Text className="text-muted">
                                Новый пароль
                            </Form.Text>
                            <Form.Control
                                value={password}
                                type="password"
                                placeholder="Введите новый пароль"
                                onChange={e => {
                                    setPassword(e.target.value.replace(/ /g, ''))
                                }}
                                //isInvalid={!(password.length >= 2 && password.length <= 32)}
                            />
                            {/*<Form.Control.Feedback type="invalid">
                                Новый пароль должен содержать от 2 до 32 символов
                            </Form.Control.Feedback>*/}
                        </Form.Group>
                    </Col>
                    <Col md={4} style={{padding: '5px'}}>
                        <Button onClick={ () => {
                            changePass(user.login, password).then(() => {
                                setPassword('')
                                getSubInfo(user.login)
                                    .then(data => {
                                        currentSub.setSubInfo(data)
                                        //console.log(data)
                                    })
                            })
                        }}>
                            Изменить пароль
                        </Button>
                    </Col>
                </Form>
                <hr/>
                <h2 className="mt-4">Пополнить баланс</h2>
                <Form className="d-flex align-items-end">
                    <Col md={4} style={{padding: '5px'}}>
                        <Form.Group controlId="formPassportFinder">
                            <Form.Text className="text-muted">
                                Сумма
                            </Form.Text>
                            <Form.Control
                                value={balance}
                                type="text-muted"
                                placeholder="Введите пополняемую сумму"
                                onChange={e => {
                                    setBalance(e.target.value.replace(/ /g, '').replace(/[^0-9.]/, ''))
                                }}
                                //isInvalid={!(Number(balance) > 0 && Number(balance) <= (999999 - Number(balance)))}
                            />
                            {/*<Form.Control.Feedback type="invalid">
                                Пополнение баланса на данную сумму невозможно
                                    (сумма должна быть больше нуля и меньше или равна {999999 - Number(balance)} руб.)
                            </Form.Control.Feedback>*/}
                        </Form.Group>
                    </Col>
                    <Col md={4} style={{padding: '5px'}}>
                        <Button
                            onClick={ () => {
                                refilBalance(user.login, balance).then(() => {
                                    setBalance('')
                                    getSubInfo(user.login)
                                        .then(data => {
                                            currentSub.setSubInfo(data)
                                            console.log(data)
                                        })
                                })
                            }}>
                            Пополнить баланс
                        </Button>
                    </Col>
                </Form>
                <hr/>
                <h2 className="mt-4">Изменить тариф</h2>
                <Form className="d-flex align-items-end" style={{marginBottom: "20px"}}>
                    <Col md={4} style={{padding: '5px'}}>
                        <Form.Group controlId="formPassportFinder">
                            <Form.Text className="text-muted">
                                Тариф
                            </Form.Text>
                            <Form.Control
                                value={newTariff}
                                type="text-muted"
                                placeholder="Название тарифа"
                                disabled={true}
                                onChange={e => {
                                    setNewTariff(e.target.value)
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} style={{padding: '5px'}}>
                        <Button
                        onClick={ () => {
                            setModalTariffShow(true)
                        }}
                        >
                            Выбрать
                        </Button>
                    </Col>
                </Form>
            </Container>
            <ModalTariff
                show={modalTariffShow}
                onHide={() => setModalTariffShow(false)}/>
        </div>
    )
})

export default Subscriber