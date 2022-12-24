import { SportType } from "../enum";

export declare interface GetDashBoardRequest {
    from: string
}

export declare interface GetDashboardResponse {
    status: string,
    data:
    {
        athlete: {
            id: string,
            name: string,
        },
        activities: {
            id: string,
            distance: number,
            sportType: SportType
        }[],
    }[]
}

export declare interface GenerateTokenRequest {
    code: string,
}

export declare interface GenerateTokenResponse {
    status: string,
    data: {
        athleteId: string,
        token: string
    }
}