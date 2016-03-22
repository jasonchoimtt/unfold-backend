// Unfold API documentation
// ========================
//
// The API is still under heavy development. Breaking changes can and will
// happen. Use with caution!

/* eslint-disable indent */
import _ from 'lodash';

import requestFactory from './request';

// Endpoint for development. Note that the database is periodically reset, so
// don't get too serious about creating data on the server.

const endpoint = 'http://localhost:3000/api';

// API Overview
// ------------
//
// The API is generally RESTful in design, so you can have a reasonable
// expectation of the API behaviour. In particular, the following are used:
//
// Type | Method | Action
// -----|--------|-------
// Collection  | GET | List items
//             | POST | Create items
//             | PATCH | Modify part of collection
// Item        | GET | Get item
//             | PUT | Update item
//
// There are also RESTless endpoints, e.g. authentication.
//
// Query strings `?like=this` are used in GET requests, and JSON is used in
// POST, PUT and PATCH requests.

async function main() {

let output = {};

let request = requestFactory((k, v) => { output[k] = v; });

// /{auth,user} - User and authentication
// --------------------------------------
//
// Defined in: `src/routes/event/{auth,user}.js`
//
// ### POST /user - Create user

/* !request Create user */

let username = `nyancat_${Math.floor(Math.random() * 100000)}`;

await request('Create user', `
    POST ${endpoint}/user
    {
        "id": "${username}",
        "password": "eightstars",
        "firstName": "Nyan",
        "lastName": "Cat",
        "email": "nyancat@unfold.online",
        "dateOfBirth": "1999-09-08" # or any ISO8601 format
    }
`);

// ### POST /auth - Authenticate user

// A simple token-based authentication is used.
/* !request Authenticate user */

let { token } = await request('Authenticate user', `
    POST ${endpoint}/auth
    {
        "username": "${username}",
        "password": "eightstars"
    }
`);

// Now you can use the token to access private endpoints, by setting the
// Authorization header:
//
// ```
// Authorization: ${token}
// ```

// ### GET /user/:id - Access user profile

/* !request Access user profile: private */

await request('Access user profile: private', `
    GET ${endpoint}/user/${username}
    Authorization: ${token}
`);

/* !request Access user profile: public  */

await request('Access user profile: public ', `
    GET ${endpoint}/user/${username}
`);

// ### PUT /user/:id - Update user profile

// Currently only `firstName` and `lastName` are updatable.
/* !request Update user profile */

await request('Update user profile', `
    PUT ${endpoint}/user/${username}
    Authorization: ${token}
    {
        "firstName": "Cat",
        "lastName": "The Nyan"
    }
`);

// /event - Event collection
// -------------------------
//
// Defined in: `src/routes/event/info.js`

// ### GET /event - List events

// **Public.** Retrieve a list of events. Currently all events are listed. Only
// basic information will be returned.
/* !request List events */

await request('List events', `
    GET ${endpoint}/event
`);

// ### POST /event - Create event

// The current user will become the owner of the event.
/* !request Create event */

let { id } = await request('Create event', `
    POST ${endpoint}/event
    Authorization: ${token}
    {
        "title": "Nyan Party",
        "location": "Outer space"
    }
`);

// ### GET /event/:id - Get event information

// **Public.** Retrieve the information of and the roles associated with the
// event.
/* !request Get event information */

await request('Get event information', `
    GET ${endpoint}/event/${id}
`);

// ### PUT /event/:id - Update event information

// **Owner.** Update the information of the event.
//
// Supported fields: `tags`, `description`, `startedAt`, `endedAt`, `timezone`,
// `language`
/* !request Update event information */

await request('Update event information', `
    PUT ${endpoint}/event/${id}
    Authorization: ${token}
    {
        "tags": ["Hong Kong", "Social"],
        "startedAt": "2014-09-25T16:00:00.000Z",
        "endedAt": null, # The ending date of the event, or null
        "timezone": 8, # Number indicating the GMT-relative time zone: -12.0 - 12.0
        "language": "zh-hk" # The language code
    }
`);

// ### GET /event/:id/roles - Get roles associated with event

// **Public.** Retrieve a list of roles associated with the event.
/* !request Get roles associated with event */

await request('Get roles associated with event', `
    GET ${endpoint}/event/${id}/roles
`);


// ### PATCH /event/:id/roles Update roles associated with event

// **Owner.** Update the roles associated with the event. Provide an array of
// role objects specifying `type` and `userId`.
//
// The provided roles are merged into the current list of roles. To remove a
// role, set `type` to `null` in the corresponding entry.
/* !request Update roles associated with event */

/* await request('Updates roles associated with event', `
    PATCH ${endpoint}/event/${id}/roles
`); */

// /event/:id/timeline - Event timeline
// ------------------------------------
//
// Defined in: `src/routes/event/timeline.js`
//
// There are two kinds of posts, self posts and link posts:
//
// Self post:
//
// Field | Type | Description
// ------|------|-------------
// author | User | The Unfold user creating the post
// author.id | String | Username of the user
// author.firstName | String | First name of the user
// author.lastName | String | Last name of the user
// author.avatar | URL | URL to the avatar of the user (not implemented yet)
// createdAt | Date | Time at which the post was created
// caption | String | Content of the self-post
//
// Link post:
//
// In addition to the above, we have:
//
// Field | Type | Description
// ------|------|-------------
// data | PostData | Data for the link
// data.content | String? | Text content
// data.image | URL? | URL to the image content
// data.url | URL | URL of the link
// date.site | String? | Name of the website the link comes from, e.g. Reddit
// data.source | String? | Part of the website the link comes from, e.g. /r/hong kong
// data.author | String? | Name of the author of the link, e.g. /u/ymcabcd
// data.createdAt | Date? | Time at which the link was created


// ### GET /event/:id/timeline{?begin,end} - Get timeline posts

// **Public.** Retrieve a subset of the posts in the timeline.
//
// Specify the time span using `begin` and `end`. If `end` or both are not
// specified, up to 100 posts will be fetched in reverse chronological order.
//
// Date formats are in ISO8601. UNIX timestamps may also work.
/* !request Get timeline posts: default */

await request('Get timeline posts: default', `
    GET ${endpoint}/event/${id}/timeline
`);

/* !request Get timeline posts: specify period */

await request('Get timeline posts: specify period', `
    GET ${endpoint}/event/${id}/timeline
    ?begin=2016-03-16T16:00:00.000Z
    &end=2016-03-18T16:00:00.000Z
`);

// ### POST /event/:id/timeline - Create new post

// **Contributor.** Create a new post in the timeline.
//
// Accepted attributes: `caption, data?.url`
/* !request Create new post */

await request('Create new post', `
    POST ${endpoint}/event/${id}/timeline
    Authorization: ${token}
    {
        "caption": "A link",
        "data": { "url": "http://www.example.com/" }
    }
`);

// /event/:id/timegram - Event timegram
// ------------------------------------
//
// Timegram provides histogram data for displaying the event activity.
//
// ### GET /event/:id/timegram{?begin,end,resolution} - Get timegram

// **Public.** Gets the timegram for the specified period and at the specified
// resolution.
//
// If `begin` or `end` is not provided, it will default to the start or end of
// the event, respectively.
//
// `resolution` is specified in seconds. Currently, it is limited to the range
// [3600, 86400].
/* !request Event timegram: specify period */

await request('Event timegram: specify period', `
    GET ${endpoint}/event/${id}/timegram
    ?begin=2014-10-25T16:00:00.000Z
    &end=2014-10-26T16:00:00.000Z
    &resolution=28800
`);

return output;

}

export default main;

if (require.main === module) {
    main()
        .then(output => {
            if (process.argv[2] === '--json')
                console.log(JSON.stringify(output, null, 4));
            else
                _.forEach(output, (out, title) => {
                    console.log(title);
                    console.log('-'.repeat(title.length));
                    console.log(out);
                });
        })
        .catch(err => { console.error(err.stack || err); });
}