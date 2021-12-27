import * as ts from 'typescript';

export class DeletedHandler<S> {
  constructor(private readonly callback: (state: S, event: any) => void) {}

  public toString(): string {
    const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };

    return `$deleted: ${
      ts.transpileModule(String(this.callback), options).outputText
    }`;
  }
}
