import Toastify from "toastify-js";
import warningIcon from "@/assets/images/toast/warning.png";
import failedIcon from "@/assets/images/toast/failed.png";
import successIcon from "@/assets/images/toast/success.png";

var _delay = 3000
var _gravity = 'top'
var _position = 'right'

const defaultValue = (delay,gravity,position) => {
  if(delay){ _delay = delay}
  if(gravity){ _gravity = gravity}
  if(position){ _position = position}
}

const error = (message,delay,gravity,position) => {
  defaultValue(delay,gravity,position)
  toast(message, failedIcon, "red");
};

const success = (message,delay,gravity,position) => {
  defaultValue(delay,gravity,position)
  toast(message, successIcon, "green");
};

const warning = (message,delay,gravity,position) => {
  defaultValue(delay,gravity,position)
  toast(message, warningIcon, "orange");
};

const toast = (message, icon, color) => {
  if (!(message && message.toString().trim().length > 0)) {
    return;
  }

  Toastify({
    text: message,
    avatar: icon,
    style: {
      background: "white",
      padding: "20px",
      fontSize: "15px",
      textAlignment: "right",
      color: color,
      textTransform: "uppercase",
      borderRadius: "5px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      width: "400px",
      display: 'flex',
      alignItems: 'center',
    },
    duration: _delay,
    newWindow: true,
    close: true,
    gravity: _gravity,
    position: _position,
    stopOnFocus: true,
  }).showToast();
};

const statusMessage = function (status) {
  status = parseInt(status);
  switch (status) {
    case 400:
      return "The server cannot or will not process the request due to something that is perceived to be a client error";

    case 401:
      return "You have no access to this page";

    case 403:
      return "You don't have permission to access on this site";

    case 404:
      return "Oops... Page not found";

    case 408:
      return "Your browser didn't send a complete request in time";

    case 415:
      return "The server is not connected";

    case 500:
      return "The server has been deserted for a while";

    case 502:
      return "No appropriate server could be found to route the request";

    case 503:
      return "The server is not ready to handle the request";

    default:
      return "Something went wrong...";
  }
};

export default { success, error, warning, statusMessage };
