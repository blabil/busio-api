export class TimeStampTools {
    static returnFormatDate(startTime : string, fullTime : number){
        const [godzina, minuty] : Array<string>= startTime.split(':')
        const date : Date = new Date();
        date.setHours(parseInt(godzina));
        date.setMinutes(parseInt(minuty));
        const timeMilis : number = fullTime * 60 * 1000; 
        date.setTime(date.getTime() + timeMilis);
        return date.toLocaleDateString("pl-PL", {
            hour: "numeric",
            minute: "numeric",
          }).split(', ')[1];
    }

    static getTimeStampFromTimeString(timeString) {
        const [hours, minutes] = timeString.split(":").map(Number);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
    }
  }