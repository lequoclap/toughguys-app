import { env } from "env";

export const config = {
    toughGuysApi: {
        stage: 'dev',
        host: env.toughGuysApiHost,
        syncData: '/synData',
        generateToken: '/generateToken',
        dashboard: '/dashboard'
    },
    stravaAuthURL: `http://www.strava.com/oauth/authorize?client_id=${env.stravaClientId}&response_type=code&redirect_uri=${env.appHost}/generateToken&approval_prompt=force&scope=activity:read_all`,
    cookie: {
        athleteId: 'athlete-id',
        accessToken: 'access-token'
    }
}