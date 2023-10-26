export interface GetCSVLog {
   id: number,
   csvLine: string;
   errorType: number;
   createdBy: string | null;
   createdAt: string | null;
   csvName: string;
   lineNumber: number;
}
