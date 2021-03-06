import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { Button } from 'semantic-ui-react'
import { IMatch } from '../../../app/models/match'
import { IPrediction, predictionStatus } from '../../../app/models/prediction'
import PredictionForm from '../PredictionForm/PredictionForm'
import { btnBetStyle } from '../PredictionPage'

interface IProps {
    match: IMatch,
    prediction: IPrediction | null,
    openModal: (body: any) => void;
    loading: boolean;
}

const PredictionDetailsActions: React.FC<IProps> = ({ match, openModal, prediction, loading }) => {

    const cannotPredict = prediction?.predictionStatus.name !== predictionStatus.open.name;

    return (
        <Fragment>
            <Button style={btnBetStyle} 
                className='button-prediction'
                disabled={cannotPredict || loading}
                onClick={() => openModal(<PredictionForm
                    prediction={prediction!}
                    initialTeam={match.teamB} />)}>
                {match.teamB.name}
            </Button>
            <Button style={btnBetStyle} 
                className='button-prediction'
                disabled={cannotPredict || loading}
                onClick={() => openModal(<PredictionForm
                    prediction={prediction!}
                    initialTeam={match.teamA} />)}>
                {match.teamA.name}
            </Button>
        </Fragment>
    )
}

export default observer(PredictionDetailsActions);