import React from 'react'
import { Segment, Label, Grid, Button, Image } from 'semantic-ui-react'
import { history } from '../../..'
import { IMatch } from '../../../app/models/match'


interface IProps {
    match: IMatch
}


export const MatchDetails: React.FC<IProps> = ({ match }) => {
    return (
        <Segment.Group>
            <Segment clearing>
                <Label basic image>
                    <img src={`/assets/${match.game.name}.png`} alt='Team' /> {match.game.displayText}
                </Label>
                {" "}
                {match.eventName}
                <span style={{ float: 'right', color: 'teal', lineHeight: '27px' }}>
                    12m 06s from now
                            </span>
            </Segment>
            <Segment>
                <Grid columns={3} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                            <Image src={match.teamA.image || '/assets/noimage.png'} centered
                                size='tiny' style={{ marginBottom: '7px' }} />
                            {match.teamA.name}
                        </Grid.Column>
                        <Grid.Column width={2}>
                            VS <br />
                            <Label content={`BO3`} />
                        </Grid.Column>
                        <Grid.Column>
                            <Image src={match.teamB.image || '/assets/noimage.png'} centered
                                size='tiny' style={{ marginBottom: '7px' }} />
                            {match.teamB.name}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment>
                <Button.Group widths={2}>
                    <Button content='Predictions' primary
                        onClick={() => history.push(`/admin/matches/${match.id}/predictions`)} />
                    <Button content='Cancel match' />
                </Button.Group>
            </Segment>
        </Segment.Group>
    )
}
