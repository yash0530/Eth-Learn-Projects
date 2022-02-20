import React, { Component } from 'react';
import campaignFactory from '../ethereum/factory';
import { Card, Button, Table } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

    static async getInitialProps() {
        const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(campaign => {
            return {
                header: campaign[2],
                description: (
                    <Table striped>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Manager</Table.Cell>
                                <Table.Cell>{ campaign[1] }</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Minimum Contribution</Table.Cell>
                                <Table.Cell>{ campaign[3] } Wei</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Link route={`/campaigns/${campaign[0]}`}>
                                        View Campaign
                                    </Link>
                                </Table.Cell>
                                <Table.Cell></Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                ),
                fluid: true
            }
        });
        return <Card.Group items={ items }/>
    }

    render() {
        return (
            <Layout>
                <Link route="/campaigns/new">
                    <Button floated="right" content='Create Campaign' icon='plus' labelPosition='left' primary />
                </Link>
                <div>
                    <h1>Open Campaigns</h1>
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;