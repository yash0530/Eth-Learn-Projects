import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button } from 'semantic-ui-react';
import { Link } from '../../../routes';

class Requests extends Component {

    static async getInitialProps(props) {
        return props.query;
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
            </Layout>
        );
    }
}

export default Requests;