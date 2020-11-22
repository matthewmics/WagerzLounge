import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Grid, GridColumn } from 'semantic-ui-react';
import { IMatch } from '../../app/models/match';
import { RootStoreContext } from '../../app/stores/rootStore';
import MatchDetail from './MatchDetails';
import MatchFilters from './MatchFilters';
import MatchPlaceholder from './MatchPlaceholder';
import InfiniteScroll from 'react-infinite-scroller';


const MatchesPage = () => {

    const rootStore = useContext(RootStoreContext);
    const { loadMatches, matchList, page, setPage, totalPages, loadingMatches } = rootStore.matchStore;

    const handleLoadNext = () => {
        if (!loadingMatches) {
            setPage(page + 1);
            loadMatches();
        }
    }

    return (
        <Grid centered>
            <GridColumn computer={12} tablet={16} mobile={16}>
                <MatchFilters />

                <InfiniteScroll
                    hasMore={!loadingMatches && (page + 1 < totalPages)}
                    initialLoad={false}
                    loadMore={handleLoadNext}
                    pageStart={0}>

                    {matchList.map((match: IMatch) => {
                        return <MatchDetail key={match.id} match={match} />
                    })}
                </InfiniteScroll>

                {loadingMatches &&
                    <MatchPlaceholder total={2} />}

            </GridColumn>
        </Grid>
    )
}

export default observer(MatchesPage);