import React from 'react';
import { Menu, Button, Container } from 'semantic-ui-react';

export default () => {
    return (
        <Menu>
        <Container>
            <Menu.Item name='KickStarter' active={ true } />
            <Menu.Menu position='right'>
                <Menu.Item name='Campaigns' />
                <Menu.Item>
                    <Button content='Create Campaigns' icon='plus' labelPosition='left' />
                </Menu.Item>
            </Menu.Menu>
        </Container>
      </Menu>
    );
}