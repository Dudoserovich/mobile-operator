import React, {useContext, useState} from 'react'
import {Button, Card, Container, Form} from 'react-bootstrap'
import {login} from '../http/userAPI'
import {observer} from 'mobx-react-lite'
import {Context} from '../index'
import {useNavigate} from 'react-router-dom'
import {ADMIN_ROUTE, MANAGER_ROUTE, SALESMAN_ROUTE, SUBSCRIBER_ROUTE} from '../utils/consts'

const Auth = observer(() => {
    const {user} = useContext(Context)
    const [log, setLog] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const click = async () => {
        try {
            let data = await login(log, password)
            user.setUser(data)
            user.setIsAuth(true)
            user.setTypeId(data.userTypeId)
            user.setLogin(data.login)
            if (user.typeId === 1) {
                navigate(ADMIN_ROUTE)
            } else if (user.typeId === 2) {
                navigate(MANAGER_ROUTE)
            } else if (user.typeId === 3) {
                navigate(SALESMAN_ROUTE)
            } else if (user.typeId === 4) {
                navigate(SUBSCRIBER_ROUTE)
            }
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-4">
                <h2 className="m-auto">Авторизация</h2>

                <Form className="d-flex flex-column">
                    <Form.Group className="mb-3" controlId="formLogin">
                        <Form.Label>Логин</Form.Label>
                        <Form.Control
                            placeholder="Логин"
                            value={log}
                            onChange={e => setLog(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            placeholder="Пароль"
                            value={password}
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="outline-primary"
                        className="mt-2"
                        onClick={click}
                    >Войти</Button>
                </Form>
            </Card>
        </Container>
    )
})

export default Auth
