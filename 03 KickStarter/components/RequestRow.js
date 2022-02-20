import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {

    state = {
        loadingApprove: false,
        loadingFinalize: false
    }

    approve = async () => {

        this.setState({ loadingApprove: true });

        const campaign = await Campaign(this.props.campaignAddress);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });

        this.setState({ loadingApprove: false });
    }

    finalize = async () => {

        this.setState({ loadingFinalize: true });

        const campaign = await Campaign(this.props.campaignAddress);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });

        this.setState({ loadingFinalize: false });
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request, contributorsCount } = this.props;
        const readyToFinalize = (request.approversCount * 2) >= contributorsCount;

        return (
            <Row positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')} Ethers</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approversCount} / {contributorsCount}</Cell>
                <Cell>
                    {request.complete ?
                        (<Button
                            color="green"
                            basic
                            disabled>
                            Approved
                        </Button>) : 
                        (<Button
                            color="green"
                            basic
                            onClick={this.approve}
                            loading={this.state.loadingApprove}
                            disabled={this.state.loadingApprove}>
                            Approve
                        </Button>)
                    }
                </Cell>
                <Cell>
                    {request.complete ?
                        (<Button
                        color="orange"
                        basic
                        disabled>
                        Finalized
                        </Button>) :
                        (<Button
                            color="orange"
                            basic
                            onClick={this.finalize}
                            loading={this.state.loadingFinalize}
                            disabled={this.state.loadingFinalize}>
                            Finalize
                        </Button>)
                    }
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;