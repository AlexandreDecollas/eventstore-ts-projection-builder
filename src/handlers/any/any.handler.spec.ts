import { AnyHandler } from './any.handler';
import * as ts from 'typescript';

describe('AnyHandler', () => {
  let handler: AnyHandler<any>;
  const callback = (state: any, event: any): void => {
    state.cpt++;
    console.log('event.tutu : ', event.tutu);
  };

  beforeEach(() => {
    handler = new AnyHandler(callback);
  });

  it(`should show '$any' at the beginning`, () => {
    expect(handler.toString().indexOf('$any:')).not.toEqual(-1);
  });

  it('should show a function compiled in js', () => {
    const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
    expect(handler.toString()).toEqual(
      '$any: ' + ts.transpileModule(String(callback), options).outputText,
    );
  });
});
