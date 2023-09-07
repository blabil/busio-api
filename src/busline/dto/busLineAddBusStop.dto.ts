import { IsNotEmpty } from "class-validator";

export class BusLineAddStopDto{

    @IsNotEmpty({message: 'Nie podano przed/po którym przystanku!.'})
    public busStop: string;

    @IsNotEmpty({message: 'Nie podano dodawanego przystanku!.'})
    public newStopID: string;

    @IsNotEmpty({message: 'Nie podano gdzie chcesz dodać!.'})
    public type: string;

    @IsNotEmpty({message: 'Nie podano czasu pomiędzy przystankami!.'})
    public time: string;

    @IsNotEmpty({message: 'Nie podano linii autobusowej!.'})
    public busLineID: string
}