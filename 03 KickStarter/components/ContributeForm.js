import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {

    state = {
        value: '',
        loading: false,
        message: '',
        error: '',
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({
            loading: true,
            message: 'Please wait... contributing to campaign',
            error: ''
        });
        const campaign = await Campaign(this.props.campaignAddress);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.campaignAddress}`);
            this.setState({ value: '', message: 'Thanks for contributing to the campaign!' });
        } catch (err) {
            this.setState({ message: '', error: err.message });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        return (
            <Form style={{
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
                <Form.Field>
                    <label><h3 style={{margin: '10px 0px'}}>Contribute to Campaign</h3></label>
                    <Input
                        value={this.state.value}
                        onChange={e => this.setState({ value: e.target.value })}
                        label="Ether"
                        labelPosition="right"
                        placeholder='0.1' />
                </Form.Field>
                <Button
                    loading={this.state.loading}
                    disabled={this.state.loading}
                    primary>
                    Contribute!
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;