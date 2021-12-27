export class FilterByFilter {
  private readonly callback: (state: any) => any;

  constructor(callBack: (state: any) => any) {
    this.callback = callBack;
  }

  public toString(): string {
    return `.filterBy(${String(this.callback)})`;
  }
}
