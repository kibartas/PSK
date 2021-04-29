import React from 'react';
import { Grid } from '@material-ui/core';
import './styles.css';
import { withRouter } from 'react-router';
import VerifyAccountCard from '../../components/VerifyAccountCard/VerifyAccountCard';

class VerifyAccountPage extends React.Component {

    componentDidMount() {
        const { userId } = this.props;
        console.log(userId)
    }

    render() {
        return (
            <Grid
                container
                className="root"
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item xs={10} sm={6} md={4} lg={3}>
                    <VerifyAccountCard />
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(VerifyAccountPage);