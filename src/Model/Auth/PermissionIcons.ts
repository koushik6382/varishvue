const IconIdentifier = (value: string) => {
  const index = value.lastIndexOf(".");
  value = value.slice(index + 1);
  var icon = "Settings";

  switch (value) {
    case "All":
      icon = "Settings";
      return icon;

    case "View":
      icon = "Eye";
      return icon;

    case "AdminView":
      icon = "View";
      return icon;

    case "Create":
      icon = "PlusCircle";
      return icon;

    case "Modify":
      icon = "Edit";
      return icon;

    case "Trash":
      icon = "Archive";
      return icon;

    case "Restore":
      icon = "RotateCcw";
      return icon;

    case "Delete":
      icon = "Trash2";
      return icon;

    default:
      return icon;
  }
};

export { IconIdentifier };
