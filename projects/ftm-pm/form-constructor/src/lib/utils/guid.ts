export class Guid {
  public static replace(c: string) {
    /* tslint:disable no-bitwise */
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r & 0x3 | 0x8 );
    /* tslint:enable no-bitwise */
    return v.toString(16);
  }


  public static v4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(new RegExp('[xy]', 'g') , Guid.replace);
  }
}
