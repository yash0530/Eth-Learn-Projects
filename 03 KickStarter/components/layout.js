import React from 'react';
import Header from './header';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';

export default props => {
    return (
        <div>
            <Head>
                <link
                    async
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
                />
            </Head>
            <Header />
            <Container>
                { props.children }
            </Container>
        </div>
    );
};