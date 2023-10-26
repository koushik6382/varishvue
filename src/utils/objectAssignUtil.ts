export default class AssignUtil<T> {
  static Set<T>(actualObj: T, list: any) {
    for (var [key, value] of Object.entries(actualObj as T[])) {
      list.forEach((x: any) => {
        if (x.key === key) {
          actualObj[key as keyof T] = x.modelValue;
        }

        if (x?.subFields?.length > 0) {
          x?.subFields.forEach((s: any) => {
            if (s.key === key) {
              actualObj[key as keyof T] = s.modelValue;
            }
          })
        }
      });
    }
  }

  static Assign<T>(defaultObj: T, list: any) {
    for (var [key, value] of Object.entries(defaultObj as T[])) {
      list.forEach((x: any) => {
        if (x.key === key) {
          x.modelValue = value;
        }

        if (x?.subFields?.length > 0) {
          x?.subFields.forEach((s: any) => {
            if (s.key === key) {
              s.modelValue = value;
            }
          })
        }

      });
    }
  }
}
