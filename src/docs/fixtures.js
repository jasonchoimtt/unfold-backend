import requestFactory from './request';
import stream from './stream';

const endpoint = 'https://dev.unfold.online/api';
// const endpoint = 'http://localhost:3000/api';

async function main() {

    let request = requestFactory((title, out) => {
        console.log(title);
        console.log('-'.repeat(title.length));
        console.log(out);
    });

    let username = `umbrella_${Math.floor(Math.random() * 100000)}`;

    await request('Create user', `
        POST ${endpoint}/user
        {
            "id": "${username}",
            "password": "eightstars",
            "name": "Socrates Oliver",
            "email": "socrates@unfold.online",
            "dateOfBirth": "1999-09-08"
        }
    `);

    let { token } = await request('Authenticate user', `
        POST ${endpoint}/auth
        {
            "username": "${username}",
            "password": "eightstars"
        }
    `);

    let { id } = await request('Create event', `
        POST ${endpoint}/event
        Authorization: ${token}
        {
            "title": "Umbrella Movement",
            "location": "Hong Kong",
            "tags": ["social", "democracy"],
            "startedAt": "2014-09-25T16:00:00.000Z",
            "endedAt": null,
            "timezone": 8,
            "language": "zh-hk"
        }
    `);

    let i = 0;
    for (let post of stream) {
        i += 1;
        // if (i > 30) break;
        let body = {};
        if (post.content)
            body.caption = post.content;
        if (post.source && post.source.path)
            body.data = { url: post.source.path };
        if (post.tags)
            body.tags = post.tags;

        await request(`Create new post ${i}`, `
            POST ${endpoint}/event/${id}/timeline
            Authorization: ${token}
            ${JSON.stringify(body)}
        `);
    }

    await new Promise(resolve => {
        console.log('Sleep for a while...');
        setTimeout(resolve, 1000 * 10);
    });

    await request('Get timeline posts: default', `
        GET ${endpoint}/event/${id}/timeline
    `);

}

export default main;

if (require.main === module) {
    main()
        .catch(err => { console.error(err.stack || err); });
}
