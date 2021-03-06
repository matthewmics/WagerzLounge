import React, { Fragment, useContext } from 'react'
import { Container, Menu, Button, Image, Dropdown, Placeholder, Label, Popup } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { observer } from 'mobx-react-lite'
import LoginForm from '../../user/LoginForm'
import RegisterForm from '../../user/RegisterForm'
import { history } from '../../..'
import { formatToLocalPH } from '../../../app/common/util/util'
import UserNotification from './UserNotification'

const NavBar = () => {
    const rootStore = useContext(RootStoreContext);
    const { openModal } = rootStore.modalStore;
    const { isLoggedIn, user, userLoading, logout } = rootStore.userStore;

    return (
        <Menu fixed='top'>

            <Container>
                <Menu.Item header onClick={() => history.push('/matches')} as='div'
                    style={{ cursor: 'pointer' }}>
                    <Image style={{ marginRight: '10px' }} height='37' src='/assets/logo.png' />
                    WagerzLounge
                </Menu.Item>
                {
                    !userLoading &&
                    <Fragment>

                        <Menu.Item
                            as={NavLink}
                            to='/matches'
                            name='matches'
                        >
                            Matches
                                </Menu.Item>
                        {/* <Menu.Item
                            as={NavLink}
                            to='/outrights'
                            name='outrights'
                        >
                            Outrights
                        </Menu.Item> */}
                        {isLoggedIn &&
                            <Fragment>

                                <Menu.Item
                                    as={NavLink}
                                    to='/profile'
                                    name='profile'
                                >
                                    Profile
                                </Menu.Item>
                            </Fragment>
                        }
                    </Fragment>
                }

                <Menu.Menu position='right'>
                    {userLoading &&
                        <Menu.Item>
                            <Placeholder style={{ height: '25px', width: '200px' }}>
                                <Placeholder.Header>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                            </Placeholder>
                        </Menu.Item>
                    }
                    {!userLoading &&
                        (
                            isLoggedIn ? (
                                <Fragment>
                                    <UserNotification />
                                    <Popup
                                        position='bottom right'
                                        on='click'
                                        pinned
                                        trigger={
                                            <Menu.Item>
                                                <Image bordered spaced avatar
                                                    size='mini'
                                                    src={user!.photo || '/assets/user_default.png'} />
                                                <div>
                                                    <div style={{
                                                        fontSize: '14px', paddingBottom: '4px',
                                                        overflow: 'hidden', maxWidth: '150px',
                                                        textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                    }}>
                                                        {user!.displayName}</div>
                                                    <Label size='tiny' color='green' content={formatToLocalPH(user!.walletBalance)} />
                                                </div>
                                            </Menu.Item>
                                        }
                                    >

                                        <div style={{ display: 'flex' }}>
                                            <Image style={{
                                                height: '50px',
                                                width: '50px',
                                                marginRight: '10px'
                                            }} bordered spaced avatar
                                                src={user!.photo || '/assets/user_default.png'} />

                                            <div style={{ minWidth: '150px' }}>
                                                <div style={{
                                                    fontWeight: 'bold',
                                                    overflow: 'hidden',
                                                    maxWidth: '150px',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {user!.displayName}
                                                </div>
                                                <span>
                                                    {user!.email}
                                                </span>
                                            </div>

                                        </div>
                                        <br />
                                        <Button fluid labelPosition='left' content='Logout' icon='power' onClick={logout}
                                            basic />

                                    </Popup>

                                </Fragment>
                            ) : (
                                    <Menu.Item>
                                        <Button.Group>
                                            <Button onClick={() => { openModal(<LoginForm />) }}>Login</Button>
                                            <Button.Or />
                                            <Button primary
                                                onClick={() => { openModal(<RegisterForm />) }}>
                                                Register
                                            </Button>
                                        </Button.Group>
                                    </Menu.Item>
                                )
                        )
                    }
                </Menu.Menu>
            </Container >
        </Menu>
    )
}


export default observer(NavBar);