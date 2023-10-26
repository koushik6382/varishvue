import "zoom-vanilla.js/dist/zoom-vanilla.min.js";
import Chart from "./chart/Main.vue";
import GoogleMapLoader from "./google-map-loader/Main.vue";
import Tippy from "./tippy/Main.vue";
import TippyContent from "./tippy-content/Main.vue";
import LoadingIcon from "./loading-icon/Main.vue";
import TinySlider from "./tiny-slider/Main.vue";
import ClassicEditor from "./ckeditor/ClassicEditor.vue";
// import BalloonBlockEditor from './ckeditor/BalloonBlockEditor.vue'
// import BalloonEditor from './ckeditor/BalloonEditor.vue'
// import DocumentEditor from './ckeditor/DocumentEditor.vue'
// import InlineEditor from './ckeditor/InlineEditor.vue'
import Dropzone from "./dropzone/Main.vue";
// import FullCalendar from "./calendar/Main.vue";
// import FullCalendarDraggable from "./calendar/Draggable.vue";
import Notification from "./notification/Main.vue";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal";
import { TransparentModal } from "./modal/TransparentModal";
import MoveableModal from "./modal/MoveableModal.vue";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownContent, DropdownItem, DropdownHeader, DropdownFooter, DropdownDivider } from "./dropdown";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "./tab";
import { AccordionGroup, AccordionItem, Accordion, AccordionPanel } from "./accordion";
import { Alert } from "./alert";
import { PreviewComponent, Preview, Source, Highlight } from "./preview-component";
import LucideIcons from "./lucide";

// import Autocomplete from "./form/autocomplete/Main.vue";
import Autocomplete from "./form/autocomplete/index.vue";
import DataTable from "./data-table/Main.vue";
import TextField from "./form/text-field/Main.vue";
import TextAdder from "./form/text-adder/Main.vue";
import PhoneNoField from "./form/phone-number/Main.vue";
import PasswordField from "./form/password-field/Main.vue";
import RadioGroup from "./form/radio/RadioGroup.vue";
import RadioBtn from "./form/radio/Main.vue";
import CheckboxGroup from "./form/checkbox/CheckboxGroup.vue";
import Checkbox from "./form/checkbox/Main.vue";
import ToggleSwitch from "./form/switch/Main.vue";
import DatePicker from "./form/date-picker/Main.vue";
import Button from "./button/Main.vue";
import IconButton from "./button/IconButton.vue";

import DataForm from "./form/dataform/Main.vue";

import Icon from "./icon/Main.vue";

import Loading from "./loading/Main.vue";
import FileUpload from "./file-upload/Main.vue";

import ConfirmModal from "./confirm-modal/Main.vue";

import Field from "./form/dataform/Field.vue";
import Fields from "./form/dataform/Fields.vue";

import CsvUpload from "./csv-upload/Main.vue";
import WModel from "./wrapper-model/Main.vue";
import FileUploadBtn from "./FileUploadBtn/Main.vue";

import ArchiveModel from "../views/components/Archive/Main.vue";
import Info from "../views/components/Info/Main.vue";
import Export from "../views/components/export/index.vue";
import Chip from "../views/components/chip/Main.vue";
import PrintLabel from "../views/components/PrintLabel/Main.vue";

import QrcodeVue from "qrcode.vue";
import MoveableCard from "./modal/MoveableCard.vue";
export default (app) => {
  app.component("MoveableCard", MoveableCard);
  app.component("WModel", WModel);

  app.component("CsvUpload", CsvUpload);
  app.component("FileUploadBtn", FileUploadBtn);

  app.component("PrintLabel", PrintLabel);
  app.component("Export", Export);
  app.component("Chip", Chip);
  app.component("ArchiveModel", ArchiveModel);

  app.component("QrcodeVue", QrcodeVue);

  app.component("TextAdder", TextAdder);

  app.component("Field", Field);
  app.component("Fields", Fields);
  app.component("DataForm", DataForm);

  app.component("Info", Info);
  app.component("FileUpload", FileUpload);
  app.component("PhoneNoField", PhoneNoField);
  app.component("Loading", Loading);
  app.component("ConfirmModal", ConfirmModal);

  app.component("PasswordField", PasswordField);
  app.component("TextField", TextField);
  app.component("RadioGroup", RadioGroup);
  app.component("RadioBtn", RadioBtn);
  app.component("CheckboxGroup", CheckboxGroup);
  app.component("Checkbox", Checkbox);
  app.component("ToggleSwitch", ToggleSwitch);
  app.component("DatePicker", DatePicker);
  app.component("Autocomplete", Autocomplete);
  app.component("DataTable", DataTable);
  app.component("Btn", Button);
  app.component("Icon", Icon);
  app.component("IconButton", IconButton);

  app.component("Chart", Chart);
  app.component("GoogleMapLoader", GoogleMapLoader);
  app.component("Tippy", Tippy);
  app.component("TippyContent", TippyContent);
  app.component("LoadingIcon", LoadingIcon);
  app.component("TinySlider", TinySlider);
  app.component("Dropzone", Dropzone);
  app.component("ClassicEditor", ClassicEditor);
  // app.component('BalloonBlockEditor', BalloonBlockEditor)
  // app.component('BalloonEditor', BalloonEditor)
  // app.component('DocumentEditor', DocumentEditor)
  // app.component('InlineEditor', InlineEditor)
  // app.component("FullCalendar", FullCalendar);
  // app.component("FullCalendarDraggable", FullCalendarDraggable);
  app.component("Notification", Notification);
  app.component("MoveableModal", MoveableModal);
  app.component("Modal", Modal);
  app.component("TransparentModal", TransparentModal);
  app.component("ModalHeader", ModalHeader);
  app.component("ModalBody", ModalBody);
  app.component("ModalFooter", ModalFooter);
  app.component("Dropdown", Dropdown);
  app.component("DropdownToggle", DropdownToggle);
  app.component("DropdownMenu", DropdownMenu);
  app.component("DropdownContent", DropdownContent);
  app.component("DropdownItem", DropdownItem);
  app.component("DropdownHeader", DropdownHeader);
  app.component("DropdownFooter", DropdownFooter);
  app.component("DropdownDivider", DropdownDivider);
  app.component("TabGroup", TabGroup);
  app.component("TabList", TabList);
  app.component("Tab", Tab);
  app.component("TabPanels", TabPanels);
  app.component("TabPanel", TabPanel);
  app.component("AccordionGroup", AccordionGroup);
  app.component("AccordionItem", AccordionItem);
  app.component("Accordion", Accordion);
  app.component("AccordionPanel", AccordionPanel);
  app.component("Alert", Alert);
  app.component("PreviewComponent", PreviewComponent);
  app.component("Preview", Preview);
  app.component("Source", Source);
  app.component("Highlight", Highlight);

  for (const [key, icon] of Object.entries(LucideIcons)) {
    app.component(key, icon);
  }
};
