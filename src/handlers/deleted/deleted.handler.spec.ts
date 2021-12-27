import * as ts from 'typescript';
import { DeletedHandler } from './deleted.handler';

describe('DeletedHandler', () => {
  let handler: DeletedHandler<any>;
  const callback = (state: any, event: any): void => {
    state.cpt++;
    console.log('event.tutu : ', event.tutu);
  };

  beforeEach(() => {
    handler = new DeletedHandler(callback);
  });

  it(`should show '$any'at the begining`, () => {
    expect(handler.toString().indexOf('$deleted:')).not.toEqual(-1);
  });

  it('should show a function compiled in js', () => {
    const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
    expect(handler.toString()).toEqual(
      '$deleted: ' + ts.transpileModule(String(callback), options).outputText,
    );
  });
});
