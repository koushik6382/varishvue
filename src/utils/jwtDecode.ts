

export const decode = (token : any) => {
    return JSON.parse(atob(token.split(".")[1]));
}