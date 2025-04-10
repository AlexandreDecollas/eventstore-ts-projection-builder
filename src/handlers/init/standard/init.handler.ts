import serializeJavascript from 'serialize-javascript';

export class InitHandler<S> {
  private callback = `$init: function f() {return ${serializeJavascript(
    this.state,
  )}}`;

  constructor(private readonly state: S) {
    this.state = state;
  }

  public toString(): string {
    return this.callback.replace(/function f/, 'function ');
  }
}
