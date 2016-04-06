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
        "name": "Nyan Cat",
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

// Currently only `name` and `profile.description` is updatable.
/* !request Update user profile */

await request('Update user profile', `
    PUT ${endpoint}/user/${username}
    Authorization: ${token}
    {
        "name": "Nyan The Cat",
        "profile": {
            "description": "Please subscribe to Cat Facts!"
        }
    }
`);

// Errors
// ------
//
// Our API uses HTTP error codes and a JSON body to show errors. For example,
// 401 Unauthorized is used for authentication problems.
/* !request Authentication error */

await request('Authentication error', `
    PUT ${endpoint}/user/${username}
    { # No Authorization header
        "name": "Nyan The Cat",
        "profile": {
            "description": "Please subscribe to Cat Facts!"
        }
    }
`, { expectError: true });

// 400 Bad Request is used for invalid data.
/* !request Invalid format */

await request('Invalid format', `
    POST ${endpoint}/event
    Authorization: ${token}
    {
        "title": 123,
        "location": "Outer space",
        "unknown": "fields"
    }
`, { expectError: true });

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

// Create some sample data.
let samples = [
    { caption: 'It works!',
      tags: ['HK'],
      data: { url: 'http://example.com' } },
    { caption: 'Interesting ah',
      tags: ['HK', 'TW'] },
    { caption: 'Good day!' },
    { caption: 'It works!',
      tags: ['HK'] },
];

let samplePosts = (await Promise.all(samples.map((body, i) => {
    return request(`Create sample post ${i}`, `
        POST ${endpoint}/event/${id}/timeline
        Authorization: ${token}
        ${JSON.stringify(body)}
    `);
})));

await request(`Create sample translation`, `
    PUT ${endpoint}/event/${id}/timeline/${samplePosts[0].id}
    Authorization: ${token}
    {
        "translations": {
            "zh-Hant": {
                "content": "它工作！"
            }
        }
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
// Supported fields: `tags`, `description`, `information`,
// `startedAt`, `endedAt`, `timezone`, `language`
// Notably, description is limited to 255 characters.
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


// ### PATCH /event/:id/roles - Update roles associated with event

// **Owner.** Update the roles associated with the event. Provide an array of
// role objects specifying `type` and `userId`.
//
// The provided roles are merged into the current list of roles. To remove a
// role, set `type` to `null` in the corresponding entry.
/* !request Update roles associated with event */

/* await request('Updates roles associated with event', `
    PATCH ${endpoint}/event/${id}/roles
`); */

// ### GET /event/:id/tags - Get tags in event

// **Public.** Returns a list of tags with their counts of posts.

/* !request Get tags in event */

await request('Get tags in event', `
    GET ${endpoint}/event/${id}/tags
`);

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
// author.name | String | Name of the user
// author.avatar | URL | URL to the avatar of the user (not implemented yet)
// createdAt | Date | Time at which the post was created
// caption | String | Content of the self-post
// tags | String[] | A list of tags
// data.translations | Object? | Contains the requested translations
// data.translations[langCode].content | String | Translated text
//
// Link post:
//
// In addition to the above, we have:
//
// Field | Type | Description
// ------|------|-------------
// data | PostData | Data for the link
// data.rel | String? | "TEXT" / "IMAGE" / "PLAYER"
// data.dimensions | Object? | { ?width: int, ?height: int }
// data.image | URL? | URL to the image content
// data.embed | URL? | URL to the iframe link
// data.content | String? | Text content
// data.url | URL | URL of the link
// data.shortUrl | URL | Short URL of the link
// date.site | String? | Name of the website the link comes from, e.g. Reddit
// data.section | String? | Part of the website the link comes from, e.g. /r/hong kong
// data.author | String? | Name of the author of the link, e.g. /u/ymcabcd
// data.author.image | URL? | Link to the author image
// data.createdAt | Date? | Time at which the link was created


// ### GET /event/:id/timeline{?begin,end,language} - Get timeline posts

// **Public.** Retrieve a subset of the posts in the timeline.
//
// Specify the time span using `begin` and `end`. If `end` or both are not
// specified, up to 10000 posts will be fetched in reverse chronological order.
//
// Specify `language` as an IETF language tag, such as `zh-Hant`, `zh-Hans` and
// `en`, to retrieve translations. If the specified translation does not exist,
// `translations[langCode]` will be `null`.
//
// Date formats are in ISO8601.
/* !request Get timeline posts: default */

await request('Get timeline posts: default', `
    GET ${endpoint}/event/${id}/timeline?language=zh-Hant
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
// Accepted attributes: `caption, data?.url, tags`
/* !request Create new post */

await request('Create new post', `
    POST ${endpoint}/event/${id}/timeline
    Authorization: ${token}
    {
        "caption": "A link",
        "data": { "url": "http://www.example.com/" },
        "tags": ["HK", "BC"]
    }
`);

// ### PUT /event/:id/timeline/:post_id - Update post

// **Contributor.** Update a post in the timeline.
//
// Accept attributes: `translations[langCode].content`
//
// As a special case of our REST endpoint, other translations not specified will
// not be destroyed.
/* !request Update post */

await request(`Update post`, `
    PUT ${endpoint}/event/${id}/timeline/${samplePosts[0].id}
    Authorization: ${token}
    {
        "translations": {
            "zh-Hant": {
                "content": "它真的在工作！"
            }
        }
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

// /translate - Translation service
// --------------------------------
//
// ### POST /translate - Translate arbitrary text

// **Authenticated.** Translate arbitrary text, to be used in translator's view.
//
// Language codes in https://msdn.microsoft.com/en-us/library/hh456380.aspx
// except `zh-CHT` (use `zh-Hant`) and `zh-CHS` (use `zh-Hans`)
// are translatable.
//
// `to` and `content` are required. Optionally specify `from` for the language
// of the provided text.
//
/* !request Translate arbitrary text */

await request('Translate arbitrary text', `
    POST ${endpoint}/translate
    Authorization: ${token}
    {
        "to": "zh-Hant",
        "content": "Hello, world!"
    }
`);

return output;

}

// WebSocket endpoints
// -------------------
//
// WebSocket endpoints have a different base URL:
//
// ```
// wss://dev.unfold.online/ws
// ```
//
// ### WebSocket /event/:id - Post updates
//
// e.g. wss://dev.unfold.online/ws/event/:id
//
// A JSON stream that emits updates of the posts. This includes creation of new
// posts ('created') and update of existing posts ('updated'), e.g. when the
// scraper has obtained new data for the post.
//
// Example of a message:
//
// Field | Type | Description
// ------|------|-------------
// resource | String | "post"
// type | String | "created" / "updated"
// data | Object | Contents of the post
//
// ```json
// {
//     "resource": "post",
//     "type": "created",
//     "data": {
//         "data": null,
//         "tags": [],
//         "id": "13",
//         "caption": "Hate you",
//         "eventId": "6",
//         "updatedAt": "2016-03-31T14:14:44.910Z",
//         "createdAt": "2016-03-31T14:14:44.910Z",
//         "authorId": null
//     }
// }
// ```
//
// ```json
// {
//     "resource": "post",
//     "type": "updated",
//     "data": {
//         "data": {
//             "url": "http://www.example.com"
//         },
//         "tags": [],
//         "id": "14",
//         "caption": "Hate you",
//         "eventId": "6",
//         "updatedAt": "2016-03-31T14:14:44.943Z",
//         "createdAt": "2016-03-31T14:14:44.926Z",
//         "authorId": null
//     }
// }
// ```

//

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
        .catch(err => { console.error(err.stack || err); process.exit(1); });
}

// <style>
// @media only screen and (min-width: 1025px) {
//   #background {
//     width: 625px;
//   }
//   ul.sections > li > div.annotation {
//     max-width: 625px;
//     min-width: 625px;
//   }
// }
// </style>
