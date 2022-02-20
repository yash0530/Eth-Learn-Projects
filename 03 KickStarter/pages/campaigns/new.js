import React, { Component } from "react";
import Layout from '../../components/layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import campaignFactory from '../../ethereum/factory';
import web3 from "../../ethereum/web3";
import { Router } from '../../routes';

class CampaignNew extends Component {

    state = {
        minimumContribution: '',
        campaignName: '',
        message: '',
        error: '',
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();
        this.setState({ loading: true, message: '', error: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            this.setState({ message: 'Please wait... creating new campaign.' });
            await campaignFactory.methods
                .createCampaign(this.state.minimumContribution, this.state.campaignName)
                .send({ from: accounts[0] });
            Router.pushRoute('/');
        } catch (err) {
            this.setState({ error: err.message, message: '' });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        return (
            <Layout>
                <h2>Create New Campaign</h2>
                <Form
                    style={{
                        maxWidth: '600px',
                        margin: '10px 0px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                    }}
                    onSubmit={this.onSubmit}
                    error={!!this.state.error}
                    success={!!this.state.message}>
                    <Message error style={{ maxWidth: '600px' }}>
                        <Message.Content>{ this.state.error }</Message.Content>
                    </Message>
                    <Message success style={{ maxWidth: '600px' }}>
                        <Message.Content>{ this.state.message }</Message.Content>
                    </Message>
                    <Form.Field style={{ maxWidth: '600px' }}>
                        <label>Campaign Name</label>
                        <Input
                            placeholder='Campaign Name'
                            value={ this.state.campaignName }
                            onChange={ event => this.setState({ campaignName: event.target.value }) }/>
                    </Form.Field>
                    <Form.Field style={{ maxWidth: '600px' }}>
                        <label>Minimum Contribution</label>
                        <Input
                            placeholder='1000000'
                            label="Wei"
                            labelPosition='right'
                            value={ this.state.minimumContribution }
                            onChange={ event => this.setState({ minimumContribution: event.target.value }) }/>
                    </Form.Field>
                    <Button color='violet'
                        loading={this.state.loading}
                        disabled={this.state.loading}
                        type='submit'>
                        Create Campaign
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;