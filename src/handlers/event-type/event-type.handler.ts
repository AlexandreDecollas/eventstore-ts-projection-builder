import * as ts from 'typescript';

export class EventTypeHandler<S, E> {
  constructor(
    private readonly eventName: string,
    private readonly callback: (state: S, event: E) => void,
  ) {
  }

  public toString(): string {
    const options = {
	 compilerOptions: {
	   module: ts.ModuleKind.CommonJS,
	   allowJs: true
	 }
    };

    let callBackAsString = String(this.callback)
	 .replace(/.*\.?emit\)?\(/, 'emit(')
	 .replace(/.*\.?linkTo\)?\(/, 'linkTo(')
	 .replace(/function.+\(/g, 'function (')

    return `${this.eventName}: ${
	 ts.transpileModule(callBackAsString, options).outputText
    }`
	 .replace(/\);/g, ')')
	 .replace(/};/g, '}')
  }
}
