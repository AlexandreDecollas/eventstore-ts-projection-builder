import * as ts from 'typescript';

export class EventTypeHandler<S, E> {
  constructor(
    private readonly eventName: string,
    private readonly callback: (state: S, event: E) => void,
  ) {}

  public toString(): string {
    const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
    let callBackAsString = String(this.callback);
    callBackAsString = callBackAsString.replace(/emit\(/, 'console.log("emit("')
    callBackAsString = callBackAsString.replace(/linkTo\(/, 'console.log("linkTo("')
    return `${this.eventName}: ${
      ts.transpileModule(callBackAsString, options).outputText
    }`
      .replace(/\);/g, ')')
      .replace(/};/g, '}')
      .replace(/console.log\("emit\(", /g, 'emit(')
      .replace(/console.log\("linkTo\(", /g, 'linkTo(')
  }
}
