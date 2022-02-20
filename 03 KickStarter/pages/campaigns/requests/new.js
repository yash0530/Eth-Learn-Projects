import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';
import web3 from '../../../ethereum/web3';
import Campaign from '../../../ethereum/campaign';

class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        receipent: '',
        message: '',
        error: '',
        loading: false
    }

    static async getInitialProps(props) {
        return props.query;
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({
            loading: true,
            message: 'Please wait... creating new request',
            error: ''
        });
        const campaign = Campaign(this.props.campaignAddress);
        const { description, value, receipent } = this.state;

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(
                    description,
                    web3.utils.toWei(value, 'ether'),
                    receipent)
                .send({ from: accounts[0] });
            this.setState({
                receipent: '',
                description: '',
                value: '',
                message: 'Your request was successfully created.'
            });
            Router.pushRoute(`/campaigns/${this.props.campaignAddress}/requests`);
        } catch (err) {
            this.setState({ message: '', error: err.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    render() {
        return (
            <Layout>
                <h2>Create New Request</h2>
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
                        <label>Description</label>
                        <Input
                            placeholder='Description'
                            value={ this.state.description }
                            onChange={ event => this.setState({ description: event.target.value }) }/>
                    </Form.Field>
                    <Form.Field style={{ maxWidth: '600px' }}>
                        <label>Value</label>
                        <Input
                            placeholder='0.01'
                            label="Ether"
                            labelPosition='right'
                            value={ this.state.value }
                            onChange={ event => this.setState({ value: event.target.value }) }/>
                    </Form.Field>
                    <Form.Field style={{ maxWidth: '600px' }}>
                        <label>Receipent</label>
                        <Input
                            placeholder='0x0000000000000000000000000000000000000000'
                            label="Address"
                            labelPosition='right'
                            value={ this.state.receipent }
                            onChange={ event => this.setState({ receipent: event.target.value }) }/>
                    </Form.Field>
                    <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                        <Button basic color='violet'>Back</Button>
                    </Link>
                    <Button
                        loading={this.state.loading}
                        disabled={this.state.loading}
                        color='violet'>
                        Create Request
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;