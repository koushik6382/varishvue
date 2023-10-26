
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const currency = (value: any) => {
    return value ? "$" + value : "$" + 0.00
}

const UtcToLocalDateTime = (date: string, format?: string) => {
    if(date){
        let _format : string  = format ? format : "MMMM D YYYY h:mm A"
        let utcZ : string = ""
       
        let utc = dayjs(date).utc(true).format().toString();
        const last = utc?.charAt(utc.length - 1)?.toLowerCase();
        
        if(last !== 'z'){
            utcZ = date+"z";
        }else{
            utcZ = date
        }
        return dayjs.utc(utcZ).local().format(_format) 
    }else{
        return  ""
    }
}

const plusUtcToLocalDateTime = (date : string,format?: string) =>{
    return date ? UtcToLocalDateTime(dayjs.utc(date).format(format).toString(),format) : ""
}

const LocalDateTime = (date: string) => {
    var obj : any = getDateObject(date);
    console.log('date',obj);
    var arrangedDate = obj ? `${obj.day}-${obj.month}-${obj.year}` : ""
    return arrangedDate ? dayjs(arrangedDate).format("MMMM D YYYY h:mm A") : ""
}

const LocalDateTimes = (date: string) => {
    const [month, day, year] = date.split('/');
    
    var arrangedDate = date ? `${month}-${day}-${year}` : ""
    return arrangedDate ? dayjs(arrangedDate).format("MMMM D YYYY h:mm A") : ""
}

const nowDate = () => {
    let now = new Date();
    return now ? dayjs(now).format("YYYY-MM-DD") : ""
}

const UtcNow = () => {
    return dayjs.utc();
}

const utcTimeDiff = (stored: number) => {
    // difference in milliseconds
    let diff: number = stored - (UtcNow().valueOf() / 1000);
    return diff;

}

const SlashLocalDate = (date: any) => {
    return date ? dayjs(date).format("MM/DD/YYYY") : ""
}

const DashLocalDate = (date: any) => {
    return date ? dayjs(date).format("DD-MM-YYYY") : ""
}

const getDateObject = (date: any)=>{
    return date ? 
    {
    year: dayjs(date).get('year'),
    month: dayjs(date).get('month')+1,
    day:dayjs(date).get('date')
    } : ""
}

const Weight = (weight: any) => {
    return weight ? weight + "Kg" : "0Kg"
}

const Millimeter = (millimeter: any) => {
    return millimeter ? millimeter : "0"
}
export { currency,LocalDateTimes, nowDate, utcTimeDiff,LocalDateTime,plusUtcToLocalDateTime, UtcNow,UtcToLocalDateTime, Weight, Millimeter, SlashLocalDate,DashLocalDate,getDateObject }