module.exports = {
    client: {
        service: {
            name: 'twitch-search-server',
            // URL to the GraphQL API
            url: 'https://twitch-search-server-de-gta5-1.nickwasused.com/graphql',
        },
        // Files processed by the extension
        includes: [
            'src/**/*.vue',
            'src/**/*.js',
        ],
    },
};