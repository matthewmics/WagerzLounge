import React from 'react'
import { AxiosResponse } from 'axios'
import { Message } from 'semantic-ui-react'

interface IProps {
    error: AxiosResponse,
    text?: string
}

export const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
    return (
        <Message error>
            {error.data && error.data.errors && Object.keys(error.data.errors).length > 0 && (
                <Message.List>
                    {error.data.error &&
                        <Message.Item>
                            error.data.error
                        </Message.Item>
                    }
                    {Object.values<string>(error.data.errors).flat().map((err, i) => (
                        <Message.Item key={i}>
                            {err}
                        </Message.Item>
                    ))}
                </Message.List>
            )}
            {text && <Message.Content content={text} />}
        </Message>
    )
}
