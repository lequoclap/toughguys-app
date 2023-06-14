import { env } from "env";

export const config = {
    toughGuysApi: {
        stage: 'dev',
        host: env.toughGuysApiHost,
        syncData: '/syncData',
        generateToken: '/generateToken',
        dashboard: '/dashboard'
    },
    adminId: env.adminId,
    stravaAuthURL: `http://www.strava.com/oauth/authorize?client_id=${env.stravaClientId}&response_type=code&redirect_uri=${env.appHost}/generateToken&approval_prompt=force&scope=activity:read_all`,
    cookie: {
        athleteId: 'athlete-id',
        accessToken: 'access-token'
    }
}