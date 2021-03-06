import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form'
import { Button, Divider, Form, Header } from 'semantic-ui-react'
import TextInput from '../../app/common/forms/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import { combineValidators, isRequired } from 'revalidate'
import { IUserFormValues } from '../../app/models/user'
import { FORM_ERROR } from 'final-form'
import { ErrorMessage } from '../../app/common/forms/ErrorMessage'
import { observer } from 'mobx-react-lite'

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

const LoginForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { closeModal } = rootStore.modalStore;
    const { login, loading } = rootStore.userStore;

    return (
        <FinalForm onSubmit={(values: IUserFormValues) => login(values).catch(error => (
            { [FORM_ERROR]: error }
        ))}
            validate={validate}
            render={({ handleSubmit, pristine, dirtySinceLastSubmit, submitError, valid }) => {
                return (
                    <Form onSubmit={handleSubmit} error style={{ overflow: 'auto' }}>
                        <Header textAlign='center' content='Login' />
                        <Divider />
                        <Field component={TextInput}
                            name='email'
                            label='Email'
                            placeholder='Email' />
                        <Field component={TextInput}
                            label='Password'
                            name='password'
                            type='password'
                            placeholder='Password' />

                        {submitError && !dirtySinceLastSubmit &&
                            <ErrorMessage  error={submitError} />}

                        <Button content='LOGIN' type='submit' primary
                            floated='right'
                            disabled={!valid && (!dirtySinceLastSubmit || pristine)}
                            loading={loading} />
                        <Button content='CANCEL'
                            type='button'
                            floated='right'
                            onClick={closeModal} />
                    </Form>
                )
            }} />
    )
}

export default observer(LoginForm);