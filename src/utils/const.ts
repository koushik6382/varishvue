const COLOR = {
  SUCCESS: '#0d9488',
  WARNING: '#',
  ERROR: '#',
  PRIMARY: '#',
  SECONDARY: '#',
  WHITE: '#FFFFFF',
}

const TEXT = {
  NO_DATA: "Currently No Data Available",
}

const CLASS = {
  OUTLINE_NONE: 'outline outline-none',
  OUTLINE_SUCCESS: 'outline outline-none',
  OUTLINE_DANGER: 'outline outline-danger',
}

const BUTTON = {
  SAVE_BTN: "Save",
  CANCEL_BTN: "Cancel",
  UPDATE_BTN: "Update",
  PRINT_BTN: "Print",
  ARCHIVE_BTN: "Archive",
}

const REGEX = {
  //alphabet letters
  NAME: /^[A-Za-z]+$/,
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  //Aa@1 min6 max8
  PASSWORD: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/,
  // yyyy/mm/dd, yyyy-mm-dd or yyyy.mm.dd
  DATE: /^(?:(?:1[6-9]|[2-9]\d)?\d{2})(?:(?:(\/|-|\.)(?:0?[13578]|1[02])\1(?:31))|(?:(\/|-|\.)(?:0?[13-9]|1[0-2])\2(?:29|30)))$|^(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\/|-|\.)0?2\3(?:29)$|^(?:(?:1[6-9]|[2-9]\d)?\d{2})(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:0?[1-9]|1\d|2[0-8])$/,
  //EAN 
  EAN: /^(\d{13})?$/,
  PRICE: /^\d*\.?\d*$/,
  NUMBER: /^[0-9]+$/,
  //10 digits 
  PHONENO: /^\d{10}$/

}

const SuperUser = "SuperUser"
const Admin = "Admin"

export { COLOR, TEXT, BUTTON, CLASS, REGEX, SuperUser,Admin }