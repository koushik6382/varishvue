import dom from "@left4code/tw-starter/dist/js/dom";
import TomSelect from "tom-select";
import { isEqual } from "lodash";

const setValue = (el, props) => {
  if (props.modelValue.length) {
    dom(el).val(props.modelValue);
  }
};

const init = (originalEl, clonedEl, props, emit, computedOptions) => {
  // On option add
  if (Array.isArray(props.modelValue)) {
    computedOptions = {
      onOptionAdd: function (value) {
        // Add new option
        const newOption = document.createElement("option");
        newOption.value = value;
        newOption.text = value;
        originalEl.add(newOption);

        // Emit option add
        emit("optionAdd", value);
      },
      ...computedOptions,
    };
  }

  clonedEl.TomSelect = new TomSelect(clonedEl, {
    ...computedOptions,
    ...{
      highlight: false,
      ...(computedOptions.onInitialize && {
        onInitialize() {
          computedOptions.onInitialize(this);
        },
      }),
      ...(computedOptions.load && {
        load(query, callback) {
          computedOptions.load(this, query, callback);
        },
      }),
      ...(computedOptions.onType && {
        onType(query) {
          computedOptions.onType(this, query);
        },
      }),
    },
  });

  addPlaceholder(clonedEl, props.modelValue, props?.placeholder);

  // On change
  clonedEl.TomSelect.on("change", function (selectedItems) {
    addPlaceholder(clonedEl, selectedItems, props?.placeholder);

    emit(
      "update:modelValue",
      Array.isArray(selectedItems) ? [...selectedItems] : selectedItems
    );
  });

  // addOptions
  clonedEl.TomSelect.addOptions = (items) => {
    items?.forEach((item) => {
      clonedEl.TomSelect.addOption(item);
    });
  };

  //loading more
  clonedEl.TomSelect.loading_more = {
    show() {
      const dropdownContainer = clonedEl.TomSelect.dropdown_content;
      const defaultLoadingMore =
        '<div class="flex items-center"><span class="spinner"></span> <span>Fetching Data...<span/></div>';
      const loadingMore = `<div class="loading_more">${
        computedOptions.render?.loadingMore() || defaultLoadingMore
      }</div>`;
      dropdownContainer.insertAdjacentHTML("afterend", loadingMore);
    },
    hide() {
      const loading_more =
        clonedEl.TomSelect.dropdown.querySelector(".loading_more");
      loading_more.parentNode.removeChild(loading_more);
    },
  };

  // On scroll
  clonedEl.TomSelect?.dropdown_content?.addEventListener("scroll", (e) => {
    if (computedOptions.onDropdownScroll) {
      const scrollPos = e.target.scrollTop;
      const listHeight = e.target.scrollHeight;
      const visibleHeight = e.target.clientHeight;

      if (scrollPos + visibleHeight >= listHeight) {
        computedOptions.onDropdownScroll(clonedEl.TomSelect);
      }
    }
  });
};

const getOptions = (options, tempOptions = []) => {
  options.each(function (optionKey, optionEl) {
    if (optionEl instanceof HTMLOptGroupElement) {
      getOptions(dom(optionEl).children(), tempOptions);
    } else {
      tempOptions.push(optionEl);
    }
  });

  return tempOptions;
};

const updateValue = (
  originalEl,
  clonedEl,
  modelValue,
  props,
  emit,
  computedOptions
) => {
  // Remove old options
  // for (const [optionKey, option] of Object.entries(
  //   clonedEl.TomSelect.options
  // )) {
  //   if (
  //     !getOptions(dom(clonedEl).prev().children()).filter((optionEl) => {
  //       return optionEl.value === option.value;
  //     }).length
  //   ) {
  //     clonedEl.TomSelect.removeOption(option.value);
  //   }
  // }

  // Update border style
  dom(clonedEl.TomSelect.wrapper).css(
    "border-color",
    dom(originalEl).css("border-color")
  );

  // Add new options
  dom(clonedEl)
    .prev()
    .children()
    .each(function () {
      clonedEl.TomSelect.addOption({
        text: dom(this).text(),
        value: dom(this).attr("value"),
      });
    });

  // Refresh options
  clonedEl.TomSelect.refreshOptions(false);

  // Update value
  if (
    (!Array.isArray(modelValue) &&
      modelValue !== clonedEl.TomSelect.getValue()) ||
    (Array.isArray(modelValue) &&
      !isEqual(modelValue, clonedEl.TomSelect.getValue()))
  ) {
    clonedEl.TomSelect.destroy();
    dom(clonedEl).html(dom(clonedEl).prev().html());
    setValue(clonedEl, props);
    init(originalEl, clonedEl, props, emit, computedOptions);
  }
};

const addPlaceholder = (clonedEl, selectedItems, placeholder) => {
  if (placeholder) {
    const inputEl = document.createElement("input");
    inputEl.setAttribute("class", "form-control");
    inputEl.setAttribute("placeholder", placeholder);

    if (Array.isArray(selectedItems) && selectedItems.length === 0) {
      inputEl.style.position = "absolute";
      inputEl.style.left = `12px`;
      inputEl.style.top = `7px`;

      clonedEl.TomSelect.control.appendChild(inputEl);
    } else if (
      typeof selectedItems === "string" &&
      selectedItems.trim().length === 0
    ) {
      clonedEl.TomSelect.control.appendChild(inputEl);
    } else {
      const inputEl = clonedEl.TomSelect.control.querySelector("input");
      inputEl?.parentNode?.removeChild(inputEl);
    }
  }
};

export { setValue, init, updateValue };
