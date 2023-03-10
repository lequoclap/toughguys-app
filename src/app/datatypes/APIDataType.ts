import { SportType } from "../enum";

export declare interface GetDashBoardRequest {
    from: string
}

export declare interface GetDashboardResponse {
    status: string,
    data: Athlete[]
}

export declare interface Athlete {

    athlete: {
        id: string,
        name: string,
        imgURL: string,
    },
    activities: Activity[],
    totalDistance: number,
    totalNewDistance: number,

}


export declare interface Activity {
    id: string,
    distance: number,
    sportType: SportType,
    newDistance: number
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