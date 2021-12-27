export class InitSharedHandler<S> {
  private readonly state: S;

  constructor(state: S) {
    this.state = state;
  }

  public toString(): string {
    return `$initShared: function f() {return ${String(
      this.state.toString(),
    )}}`;
  }
}
