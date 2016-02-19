import axios from 'axios';
import _ from 'lodash';
import { app } from './';
import { User } from './models';


/**
 * Hooks to initiate the test server.
 */
const port = process.env.PORT || 3001;
const ip = process.env.IP || '0.0.0.0';
let server = null;

before(function() {
    return new Promise((resolve, reject) => {
        server = app.listen(port, ip);
        server.on('listening', resolve);
        server.on('error', reject);
    });
});

after(function() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) reject(err);
            else resolve();
        });
    });
});

function createAxios(options) {
    return axios.create(_.defaults(options, {
        baseURL: `http://${ip}:${port}/`,
    }));
}

/**
 * Axios instance for test server endpoints.
 */
export const request = createAxios();

export async function createTestUser(id = 'test_user') {
    let [user] = await User.findOrCreate({ where: { id: id } });
    await user.setPassword('test_pw');
    user = await user.save();
    let resp = await request.post('api/auth/', {
        data: {
            username: id,
            password: 'test_pw',
        },
    });
    return {
        user,
        token: resp.data.token,
        requestAuth: createAxios({
            headers: {
                'Authorization': resp.data.token,
            },
        }),
    };
}
