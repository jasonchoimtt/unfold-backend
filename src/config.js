import url from 'url';


export const Config = {
    database: (() => {
        let ip = url.parse(process.env.DOCKER_HOST || '').hostname || '127.0.0.1';

        return `postgres://unfold:unfold_icup@${ip}:5432/unfold`;
    })(),
};
