import { IsNotEmpty, IsString } from "class-validator";

export class busLineRouteDto{

    @IsNotEmpty({message: 'Nie podano ID linii.'})
    @IsString()
    public busLineID: string;

    @IsNotEmpty({message: 'Nie podano godziny startu trasy.'})
    @IsString()
    public startTime: string;

    @IsNotEmpty({message: 'Nie podano typu czasu trasy!.'})
    @IsString()
    public time: string;

    @IsNotEmpty({message: 'Nie podano typu trasy!.'})
    public type;

}