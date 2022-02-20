import React, { Component } from "react";
import Layout from "../../components/Layout";
import campaign from '../../ethereum/campaign';
import { Button, Table } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaignSummary = await campaign(props.query.campaignAddress)
            .methods.getSummary().call();
        return {
            name: campaignSummary[0],
            manager: campaignSummary[1],
            minContribution: campaignSummary[2],
            balance: campaignSummary[3],
            requestsCount: campaignSummary[4],
            contributorsCount: campaignSummary[5],
            campaignAddress: props.query.campaignAddress
        };
    }

    renderCards = () => {
        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <Table celled style={{ margin: '5px 10px 5px 0px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell><h4>{this.props.manager}</h4></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Address of Manager</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>The manager created this campaign and can create requests for this campaign</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
                <div style={{ display: 'flex' }}>
                    <Table celled style={{ margin: '5px 10px 5px 0px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell><h4>{this.props.minContribution} Wei</h4></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Minimum Contribution</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>You must contribute at least this much wei to become an approver / contributor</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Table celled style={{ margin: '5px 10px 5px 0px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell><h4>{web3.utils.fromWei(this.props.balance, 'ether')} Ethers</h4></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Campaign Balance</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>A request tries to withdraw money from the contract. Requests must be approved by approvers</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
                <div style={{ display: 'flex' }}>
                    <Table celled style={{ margin: '5px 10px 5px 0px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell><h4>{this.props.requestsCount} Requests</h4></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Number of Requests</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>A request tries to withdraw money from the contract. Requests must be approved by approvers</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <Table celled style={{ margin: '5px 10px 5px 0px' }}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell><h4>{this.props.contributorsCount} Contributors</h4></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Number of Contributors</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Number of people who have already donated to this campaign</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
            
        );
    }

    render() {
        return (
            <Layout>
                <h1>{this.props.name}</h1>
                <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                    <Button color='violet' style={{marginBottom: '10px'}}>View Requests</Button>
                </Link>
                {this.renderCards()}
                <ContributeForm campaignAddress={this.props.campaignAddress} />
            </Layout>
        );
    }
}

export default CampaignShow;