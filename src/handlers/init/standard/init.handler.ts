import serializeJavascript from 'serialize-javascript';

export class InitHandler<S> {
  private callback!: string

  constructor(private readonly state: S) {
    this.state = state;
    this.callback = `$init: function f() {return ${serializeJavascript(
	 this.state,
    )}}`;
  }

  public toString(): string {
    return this.callback.replace(/function f/, 'function ');
  }
}
