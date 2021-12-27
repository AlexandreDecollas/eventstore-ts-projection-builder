export class TransformByFilter {
  private readonly callback: (state: any) => any;

  constructor(callBack: (state: any) => any) {
    this.callback = callBack;
  }

  public toString(): string {
    return `.transformBy(${String(this.callback)})`;
  }
}
