import { HttpClient } from '@angular/common/http';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

export class TranslateBrowserLoader implements TranslateLoader {

  /**
   * Constructor TranslateBrowserLoader
   *
   * @param {string} prefix
   * @param {string} suffix
   * @param {TransferState} transferState
   * @param {HttpClient} http
   */
  public constructor(private prefix: string = 'i18n',
              private suffix: string = '.json',
              private transferState: TransferState,
              private http: HttpClient) {
  }

  /**
   * Return translation
   *
   * @param {string} lang
   * @returns {Observable<any>}
   */
  public getTranslation(lang: string): Observable<any> {
    const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
    const data = this.transferState.get(key, null);

    // First we are looking for the translations in transfer-state, if none found, http load as fallback
    if (data) {
      return Observable.create(observer => {
        observer.next(data);
        observer.complete();
      });
    } else {
      return new TranslateHttpLoader(this.http, this.prefix, this.suffix).getTranslation(lang);
    }
  }
}
