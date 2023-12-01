import { createClient } from 'redis';

const client = createClient({
    password: 'tEB5yXPq5K5jJHVpG7uJnaHfRqRI1Ifi',
    socket: {
        host: 'redis-19639.c321.us-east-1-2.ec2.cloud.redislabs.com',
        port: 19639
    }
});

export default client;