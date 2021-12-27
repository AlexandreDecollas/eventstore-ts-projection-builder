export class PartitionByFilter {
  private readonly callback: (event: any) => any;

  constructor(callBack: (event: any) => any) {
    this.callback = callBack;
  }

  public toString(): string {
    return `.partitionBy(${String(this.callback)})`;
  }
}
