import path from "path";
import url from 'url'

export class Loco {
  constructor() {
    this.localeMap = {};
  }

  // eg: addLocale('en', '/locales/en.js')
  async addLocale(locale, file) {
    console.log("addLocale", locale, file);

    const fullPath = url.pathToFileURL(path.join(process.cwd(), file));
    console.log("loco path: ", fullPath);

    let localeTemplates = await import(fullPath);
    this.localeMap[locale] = localeTemplates.templates;
  }

  // eg: msg('Hello', {id: 'hello', locale: 'en'})
  // To not have to pass in the locale all the time, make a wrapper function:
  // const msg = (str, opts={}) => loco.msg(str, {...{locale: 'en'}, ...opts})
  msg(str, opts = {}) {
    if (!opts.id) return str;
    if (!opts.locale) return str;
    if (this.localeMap[opts.locale]) {
      let s = this.localeMap[opts.locale][opts.id];
      if (s) return s;
    }
    return str;
  }

  msgFunc(opts = {}) {
    return (str, opts2 = {}) => {
      return this.msg(str, { ...opts, ...opts2 });
    };
  }
}

// default Loco
export const loco = new Loco();
export function msg(str, opts = {}) {
  return loco.msg(str, opts);
}
export function addLocale(locale, file) {
  return loco.addLocale(locale, file);
}
