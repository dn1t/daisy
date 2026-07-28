// This file is adapted from tough-cookie-file-store (https://github.com/ivanmarban/tough-cookie-file-store/blob/master/lib/cookie-file-store.ts)
// Copyright (c) 2016 Ivan Marban
// Licensed under the MIT License.
// Written by Ivan Marban, Christian Dannie Storgaard, Emily Marigold Klassen & Luis Finke

import { env } from "cloudflare:workers";
import {
  type Callback,
  canonicalDomain,
  Cookie,
  type ErrorCallback,
  type Nullable,
  pathMatch,
  permuteDomain,
  Store,
} from "tough-cookie";

type CookiesMap = { [key: string]: Cookie };
type CookiesDomainData = { [path: string]: CookiesMap };
type CookiesIndex = { [domain: string]: CookiesDomainData };

export default class KVCookieStore extends Store {
  synchronous: boolean = true;
  idx: CookiesIndex = {};

  httpOnlyExtension: boolean = true;

  private _readPromise: Promise<boolean> | undefined;
  private _writePromise: Promise<void> | undefined;
  private _nextWritePromise: Promise<void> | undefined;

  constructor() {
    super();

    const promise = env.daisy
      .get<{ [domain: string]: { [path: string]: { [key: string]: never } } }>("cookies", "json")
      .then((cookies) => {
        if (!cookies) return false;
        for (const [domain, domainData] of Object.entries(cookies)) {
          for (const [path, cookiesMap] of Object.entries(domainData)) {
            for (const [key, cookieData] of Object.entries(cookiesMap)) {
              const cookie = Cookie.fromJSON(cookieData);
              if (cookie) {
                if (!this.idx[domain]) this.idx[domain] = {};
                if (!this.idx[domain][path]) this.idx[domain][path] = {};
                this.idx[domain][path][key] = cookie;
              }
            }
          }
        }
        return cookies !== undefined;
      });
    this._readPromise = promise;

    promise
      .then(
        () => delete this._readPromise,
        (err) => {
          delete this._readPromise;
          console.error(err);
        },
      )
      .catch((err) => console.error(err));
  }

  private _doSyncReadAsAsync<TResult>(
    action: () => TResult,
    cb: Callback<TResult> | undefined,
  ): undefined | Promise<TResult> {
    if (this._readPromise) {
      const promise = this._readPromise;
      if (typeof cb === "function") {
        const continueFunc = () => {
          try {
            let result: TResult;
            try {
              result = action();
            } catch (error) {
              cb(error as Error, undefined);
              return;
            }
            cb(null, result);
          } catch (error) {
            console.error(error);
          }
        };
        promise.then(continueFunc, continueFunc);
      } else {
        const continueFunc = () => action();
        return promise.then(continueFunc, continueFunc);
      }
    } else {
      if (typeof cb === "function") {
        let result: TResult;
        try {
          result = action();
        } catch (error) {
          cb(error as Error, undefined);
          return;
        }
        cb(null, result);
      } else {
        return (async () => action())();
      }
    }
  }

  _doSyncWriteAsAsync(action: () => boolean, cb: ((error: Error | null) => void) | undefined): void | Promise<void> {
    if (this._readPromise) {
      const promise = this._readPromise;
      if (typeof cb === "function") {
        const continueFunc = () => {
          let done = false;
          try {
            if (action()) {
              this._saveAsync((error) => {
                if (!done) {
                  done = true;
                  cb(error);
                } else console.error(error);
              });
            } else {
              done = true;
              cb(null);
            }
          } catch (error) {
            if (!done) {
              done = true;
              cb(error as Error);
            } else console.error(error);
          }
        };
        promise.then(continueFunc, continueFunc);
      } else {
        const continueFunc = () => {
          if (action()) return this._saveAsync();
        };
        return promise.then(continueFunc, continueFunc);
      }
    } else {
      let changed: boolean;
      try {
        changed = action();
      } catch (error) {
        if (typeof cb === "function") {
          cb(error as Error);
          return;
        } else return Promise.reject(error);
      }
      if (changed) return this._saveAsync(cb);
      else {
        if (typeof cb === "function") cb(null);
        else return Promise.resolve();
      }
    }
  }

  findCookie(
    domain: Nullable<string>,
    path: Nullable<string>,
    key: Nullable<string>,
    cb: Callback<Cookie | undefined>,
  ): void;
  findCookie(domain: Nullable<string>, path: Nullable<string>, key: Nullable<string>): Promise<Cookie | undefined>;
  findCookie(
    domain: Nullable<string>,
    path: Nullable<string>,
    key: Nullable<string>,
    cb?: Callback<Cookie | undefined>,
  ): undefined | Promise<Cookie | undefined> {
    return this._doSyncReadAsAsync(() => {
      if (domain == null || path == null || key == null) {
        return undefined;
      }
      return this.idx[domain]?.[path]?.[key];
    }, cb);
  }

  findCookies(
    domain: Nullable<string>,
    path: Nullable<string>,
    allowSpecialUseDomain?: boolean,
    cb?: Callback<Cookie[]>,
  ): void;
  findCookies(domain: Nullable<string>, path: Nullable<string>, allowSpecialUseDomain?: boolean): Promise<Cookie[]>;
  findCookies(
    domain: Nullable<string>,
    path: Nullable<string>,
    allowSpecialUseDomain?: boolean,
    cb?: Callback<Cookie[]>,
  ): undefined | Promise<Cookie[]> {
    if (typeof allowSpecialUseDomain === "function") {
      cb = allowSpecialUseDomain;
      allowSpecialUseDomain = undefined;
    }
    allowSpecialUseDomain ??= false;
    return this._findCookiesAsync(domain, path, allowSpecialUseDomain, cb);
  }

  private _findCookiesAsync(
    domain: Nullable<string>,
    path: Nullable<string>,
    allowSpecialUseDomain: boolean,
    cb?: Callback<Cookie[]>,
  ): undefined | Promise<Cookie[]> {
    return this._doSyncReadAsAsync(() => {
      const results: Cookie[] = [];
      if (!domain) return results;

      let pathMatcher: (domainIndex: CookiesDomainData) => void;
      if (!path) {
        pathMatcher = function matchAll(domainIndex: CookiesDomainData) {
          for (const curPath of Object.keys(domainIndex)) {
            const pathIndex = domainIndex[curPath];
            for (const key of Object.keys(pathIndex)) {
              results.push(pathIndex[key]);
            }
          }
        };
      } else {
        pathMatcher = function matchRFC(domainIndex: CookiesDomainData) {
          for (const cookiePath of Object.keys(domainIndex)) {
            if (pathMatch(path, cookiePath)) {
              const pathIndex = domainIndex[cookiePath];
              for (const key of Object.keys(pathIndex)) {
                results.push(pathIndex[key]);
              }
            }
          }
        };
      }

      const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain];
      const idx = this.idx;
      for (const curDomain of domains) {
        const domainIndex = idx[curDomain];
        if (!domainIndex) continue;
        pathMatcher(domainIndex);
      }

      return results;
    }, cb);
  }

  putCookie(cookie: Cookie, cb: ErrorCallback): void;
  putCookie(cookie: Cookie): Promise<void>;
  putCookie(cookie: Cookie, cb?: ErrorCallback): void | Promise<void> {
    if (!cookie.expires?.valueOf()) cookie.setExpires(new Date(Date.now() + 30 * 60 * 1000));
    return this._doSyncWriteAsAsync(() => {
      const { domain, path, key } = cookie;
      const canDomain = canonicalDomain(domain);
      if (canDomain == null || path == null || key == null) return false;

      let domainVal = this.idx[canDomain];
      if (!domainVal) {
        domainVal = {};
        this.idx[canDomain] = domainVal;
      }

      let pathVal = domainVal[path];
      if (!pathVal) {
        pathVal = {};
        domainVal[path] = pathVal;
      }
      pathVal[key] = cookie;
      return true;
    }, cb);
  }

  updateCookie(_: Cookie, newCookie: Cookie, cb: ErrorCallback): void;
  updateCookie(_: Cookie, newCookie: Cookie): Promise<void>;
  updateCookie(_: Cookie, newCookie: Cookie, cb?: ErrorCallback): void | Promise<void> {
    if (cb) return this.putCookie(newCookie, cb);
    else return this.putCookie(newCookie);
  }

  removeCookie(domain: string, path: string, key: string, cb: ErrorCallback): void;
  removeCookie(domain: string, path: string, key: string): Promise<void>;
  removeCookie(domain: string, path: string, key: string, cb?: ErrorCallback): void | Promise<void> {
    return this._doSyncWriteAsAsync(() => {
      const domainVal = this.idx[domain];
      if (!domainVal) return false;

      const pathVal = domainVal[path];
      if (!pathVal) return false;

      const deleted = delete pathVal[key];
      if (deleted && Object.keys(pathVal).length === 0) {
        delete domainVal[path];
        if (Object.keys(domainVal).length === 0) {
          delete this.idx[domain];
        }
      }

      return deleted;
    }, cb);
  }

  removeCookies(domain: string, path: Nullable<string>, cb: ErrorCallback): void;
  removeCookies(domain: string, path: Nullable<string>): Promise<void>;
  removeCookies(domain: string, path: Nullable<string>, cb?: ErrorCallback): void | Promise<void> {
    return this._doSyncWriteAsAsync(() => {
      if (path != null) {
        const domainVal = this.idx[domain];
        if (domainVal) {
          const deleted = delete domainVal[path];
          if (deleted && Object.keys(domainVal).length === 0) {
            delete this.idx[domain];
          }
          return deleted;
        }
        return false;
      } else {
        const deleted = delete this.idx[domain];
        return deleted;
      }
    }, cb);
  }

  removeAllCookies(cb: ErrorCallback): void;
  removeAllCookies(): Promise<void>;
  removeAllCookies(cb?: ErrorCallback): void | Promise<void> {
    return this._doSyncWriteAsAsync(() => {
      if (Object.keys(this.idx).length === 0) return false;
      this.idx = {};
      return true;
    }, cb);
  }

  getAllCookies(cb: Callback<Cookie[]>): void;
  getAllCookies(): Promise<Cookie[]>;
  getAllCookies(cb?: Callback<Cookie[]>): undefined | Promise<Cookie[]> {
    return this._doSyncReadAsAsync(() => {
      const cookies: Cookie[] = [];
      for (const domain of Object.keys(this.idx)) {
        const domainVal = this.idx[domain];
        for (const p of Object.keys(domainVal)) {
          const pVal = domainVal[p];
          for (const key of Object.keys(pVal)) {
            const cookie = pVal[key];
            if (key != null) {
              cookies.push(cookie);
            }
          }
        }
      }

      cookies.sort((a, b) => (a.creationIndex || 0) - (b.creationIndex || 0));
      return cookies;
    }, cb);
  }

  private _saveAsync(cb?: ErrorCallback): void | Promise<void> {
    if (!this._nextWritePromise) {
      this._nextWritePromise = (async () => {
        if (this._writePromise) {
          try {
            await this._writePromise;
          } catch {}
        } else await Promise.resolve();

        this._writePromise = this._nextWritePromise;
        this._nextWritePromise = undefined;

        try {
          await env.daisy.put("cookies", JSON.stringify(this.idx));
        } finally {
          this._writePromise = undefined;
        }
      })();
    }

    if (typeof cb === "function") {
      this._nextWritePromise
        .then(
          () => cb(null),
          (error) => cb(error),
        )
        .catch((error) => console.error(error));
    } else return this._nextWritePromise;
  }
}
