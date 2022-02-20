import React from 'react';
import { Menu, Button, Container } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu>
            <Container>
                <Link route="/">
                    <a className='item active'>KickStarter</a>
                </Link>
                <Menu.Menu position='right'>
                    <Link route="/campaigns/new">
                        <a className='item'>
                            <Button content='Create Campaigns' icon='plus' labelPosition='left' />
                        </a>
                    </Link>
                </Menu.Menu>
            </Container>
      </Menu>
    );
}