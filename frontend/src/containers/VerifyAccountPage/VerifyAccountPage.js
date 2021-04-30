import React from 'react';
import { Grid } from '@material-ui/core';
import './styles.css';
import { withRouter } from 'react-router';
import VerifyAccountCard from '../../components/VerifyAccountCard/VerifyAccountCard';
import { verify } from '../../api/PublicAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';

class VerifyAccountPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showVerificationError: false,
            showVerificationSuccess: false
        }
    }

    componentDidMount() {
        const { match } = this.props;
        const id = match.params.userId;
        verify(id).then(() => this.setState({ showVerificationSuccess: true }))
            .catch(() => this.setState({ showVerificationError: true }))
    }

    render() {
        const { showVerificationError } = this.state;
        const { showVerificationSuccess } = this.state;

        const hideVerificationError = () => {
            this.setState({ showVerificationError: false })
        }

        const hideVerificationSuccess = () => {
            this.setState({ showVerificationSuccess: false })
        }

        return (
            <>
                {showVerificationError &&
                    <CustomSnackbar
                        topCenter
                        message="Error has occured during verification"
                        onClose={hideVerificationError}
                        severity="error" />
                }
                {showVerificationSuccess &&
                    <CustomSnackbar
                        topCenter
                        message="Account verified successfully"
                        onClose={hideVerificationSuccess}
                        severity="success" />
                }
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
            </>
        );
    }
}

export default withRouter(VerifyAccountPage);