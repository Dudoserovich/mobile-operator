import React, {useContext, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Button, Col, Container, Form, Modal, Table} from 'react-bootstrap'
import {Context} from '../index'
import {changeUser, deleteUser, findManagerAndSalesman, getAllManagerAndSalesman, getUser} from '../http/adminAPI'
import {registration} from '../http/userAPI'
import {changeTariff, getAllTariffs} from "../http/tariffAPI";

const person = 'https://www.svgrepo.com/show/311063/person.svg'

const Admin = observer(() => {
    const {user} = useContext(Context)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [userType, setUserType] = useState(2)

    const [findLogin, setFindLogin] = useState('')
    const [findType, setFindType] = useState('')

    const [modalShow, setModalShow] = useState(false)
    const [modalUser, setModalUser] = useState({})

    useEffect(() => {
        getAllManagerAndSalesman()
            .then(data => user.setDownloadedUsers(data))
    }, [])

    const validate = () => {
        return document.querySelector('.is-invalid') === null
    }

    const userRegistration = async () => {
        if (validate()) {
            try {
                await registration(login, password, userType)
            } catch (e) {
                alert(e.response.data.message)
            }
        } else alert('Не все поля корректны!')
    }

    const find = async (findLogin, findType) => {
        try {
            return await findManagerAndSalesman(findLogin, findType)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const delUser = async (login) => {
        try {
            await deleteUser(login)
            getAllManagerAndSalesman()
                .then(data => {
                    return user.setDownloadedUsers(data)
                })
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const getOneUser = async (id) => {
        try {
            return await getUser(id)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const MyVerticallyCenteredModal = (props) => {
        const [login, setLogin] = useState(props.user.login || '')
        const [password, setPassword] = useState(props.user.password || '')
        const [userTypeId, setUserType] = useState(props.user.userTypeId || '')

        const change = async () => {
            if (document.querySelector('.modalForm div div .form-control.is-invalid') === null) {
                //alert('All done!')
                try {
                    await changeUser(props.user.login, login, password, userTypeId)
                    getAllManagerAndSalesman()
                        .then(data => user.setDownloadedUsers(data))
                } catch (e) {
                    alert(e.response.data.message)
                }
            } else alert('Не все поля корректны!')
        }

        return (
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Изменение данных пользователя
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="modalForm">
                        <Col md={5} style={{padding: '5px'}}>
                            <Form.Group controlId="formRegistrationLogin">
                                <Form.Text className="text-muted">
                                    Логин пользователя
                                </Form.Text>
                                <Form.Control size="lg" type="text" value={login}
                                              onChange={(e) => setLogin(e.target.value.replace(/ /g, ''))} placeholder="Логин"
                                              isInvalid={!(login.length > 0 && login.length <= 32)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Логин не может быть пустым или больше чем 32 символа
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={5} style={{padding: '5px'}}>
                            <Form.Group controlId="formRegistrationType">
                                <Form.Text className="text-muted">
                                    Должность пользователя
                                </Form.Text>
                                <Form.Select aria-label="Default select example" value={userTypeId}
                                             onChange={(e) => setUserType(e.target.value)}>
                                    <option value="2">Менеджер</option>
                                    <option value="3">Продавец-консультант</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={5} style={{padding: '5px'}}>
                            <Form.Group controlId="formRegistrationPassword">
                                <Form.Text className="text-muted">
                                    Пароль пользователя
                                </Form.Text>
                                <Form.Control value={password} onChange={(e) => {
                                    setPassword(e.target.value)
                                }} type="text" placeholder="Пароль"
                                              isInvalid={!(password.length > 0 && password.length <= 32)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Пароль не может быть пустым или больше чем 32 символа
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
                                alert('Пользователь изменён')
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
                <h1 className="mt-4">Панель администратора</h1>
                <hr/>
            </Container>
            <Container>
                <h2 className="mt-4">Создать пользователя</h2>
                <Form className="">
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegistrationType">
                            <Form.Text className="text-muted">
                                Должность пользователя
                            </Form.Text>
                            <Form.Select
                                aria-label="Default select example"
                                value={userType}
                                onChange={e => setUserType(e.target.value)}
                            >
                                <option value="2">Менеджер</option>
                                <option value="3">Продавец-консультант</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegistrationLogin">
                            <Form.Text className="text-muted">
                                Логин пользователя
                            </Form.Text>
                            <Form.Control
                                value={login}
                                type="text"
                                onChange={e => setLogin(e.target.value)}
                                placeholder="Логин"
                                isInvalid={!(login.length > 0 && login.length <= 32)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Логин не может быть пустым или больше чем 32 символа
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formRegistrationPassword">
                            <Form.Text className="text-muted">
                                Пароль пользователя
                            </Form.Text>
                            <Form.Control
                                value={password}
                                type="password"
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Пароль"
                                isInvalid={!(password.length > 0 && password.length <= 32)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Пароль не может быть пустым или больше чем 32 символа
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={2} style={{padding: '5px'}}>
                        <Button
                            variant="outline-success"
                            type="submit"
                            onClick={userRegistration}>Добавить</Button>
                    </Col>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Поиск</h2>
                <Form className="d-flex align-items-end">
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formLoginFinder">
                            <Form.Text className="text-muted">
                                Введите логин пользователя
                            </Form.Text>
                            <Form.Control value={findLogin} type="text" placeholder="Найти" onChange={(e) => {
                                setFindLogin(e.target.value.replace(/ /g, ''))
                                find(e.target.value.replace(/ /g, ''), findType).then(data => user.setDownloadedUsers(data))
                            }}/>
                        </Form.Group>
                    </Col>
                    <Col md={5} style={{padding: '5px'}}>
                        <Form.Group controlId="formUserTypeIdFinder">
                            <Form.Text className="text-muted">
                                Должность пользователя
                            </Form.Text>
                            <Form.Select value={findType} aria-label="Default select example" onChange={(e) => {
                                setFindType(e.target.value)
                                find(findLogin, e.target.value).then(data => user.setDownloadedUsers(data))
                            }}>
                                <option value="">Все</option>
                                <option value="2">Менеджер</option>
                                <option value="3">Продавец-консультант</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Form>
            </Container>
            <Container>
                <h2 className="mt-4">Пользователи</h2>
                <Table className="mt-4" hover={true}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Логин</th>
                        <th></th>
                        <th>Должность</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        user.downloadedUsers.map((user, index) => {
                                return (
                                    <tr key={user.login}>
                                        <td>{index + 1}</td>
                                        <td>{user.login}</td>
                                        <td>{<img height={30} src={person}/>}</td>
                                        <td>{user.userTypeId === 2 ? 'Менеджер' : 'Продавец-консультант'}</td>
                                        <td>
                                            <Button className="me-4" variant="outline-warning" onClick={() => {
                                                getOneUser(user.login).then(data => {
                                                    setModalUser(data)
                                                    setModalShow(true)
                                                })
                                            }}>Изменить</Button>
                                            <Button variant="outline-danger" onClick={() => {
                                                delUser(user.login)
                                                alert(`Пользователь с логином "${user.login}" удалён`)
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
            <MyVerticallyCenteredModal user={modalUser} show={modalShow} onHide={() => setModalShow(false)} />
        </div>
    )
})

export default Admin
