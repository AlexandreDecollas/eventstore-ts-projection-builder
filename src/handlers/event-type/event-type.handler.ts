import * as ts from 'typescript';

export class EventTypeHandler<S, E> {
  constructor(
    private readonly eventName: string,
    private readonly callback: (state: S, event: E) => void,
  ) {}

  public toString(): string {
    const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };

    return `${this.eventName}: ${
      ts.transpileModule(String(this.callback), options).outputText
    }`
      .replace(/\);/g, ')')
      .replace(/};/g, '}');
  }
}
