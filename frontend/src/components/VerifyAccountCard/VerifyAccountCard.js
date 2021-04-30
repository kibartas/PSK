import React from 'react';
import { Button, CardContent, Grid, Paper, Typography } from '@material-ui/core';
import confirmEmailDrawing from '../../assets/VerifyAccountPage/ill-confirmation.svg';


export default function VerifyAccountCard() {
    return (
        <Paper elevation={3}>
            <CardContent
                direction="column"
                align="center"
                justify="center"
            >
                <img
                    src={confirmEmailDrawing}
                    alt="Illustration of a mail with notification"
                />
                <Typography variant="h4" gutterBottom>Account verified</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography>You can now sign in</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            href="/login"
                        >
                            Back to login
            </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Paper>
    )
}