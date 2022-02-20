import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class Requests extends Component {

    static async getInitialProps(props) {
        const { campaignAddress } = props.query;
        const campaign = Campaign(campaignAddress);
        const requestCount = await campaign.methods.requestsCount().call();
        const contributorsCount = await campaign.methods.contributorsCount().call();  

        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((elem, ind) => {
                return campaign.methods.requests(ind).call();
            })
        );
        console.log(requests);

        return { campaignAddress, requests, requestCount, contributorsCount };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                request={request}
                key={index}
                id={index}
                campaignAddress={this.props.campaignAddress}
                contributorsCount={this.props.contributorsCount}
            />;
        });
    }

    renderTable() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Table striped celled>
                <Header>
                    <Row>
                        <HeaderCell>Id</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {this.renderRows()}
                </Body>
            </Table>
        );
    }

    render() {
        return (
            <Layout>
                <h1>Requests</h1>
                <Link route={`/campaigns/${this.props.campaignAddress}`}>
                    <Button basic color='violet'>Back</Button>
                </Link>
                <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
                    <Button color='violet'>Add Request</Button>
                </Link>
                {this.renderTable()}
                <p>{`Found ${this.props.requestCount} Requests`}</p>
            </Layout>
        );
    }
}

export default Requests;