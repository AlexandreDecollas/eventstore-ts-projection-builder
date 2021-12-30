import * as ts from 'typescript';
import { EventTypeHandler } from './event-type.handler';

class State {
  toto: number;
  tutu = 'bla';
  cpt = 0;
}

class EventType {
  id: number;
  blop = '555-666';
  tutu: { gg: 33 };
}

describe('EventTypeHandler', () => {
  let handler: EventTypeHandler<State, EventType>;
  const callback = (state: State, event: EventType): void => {
    state.cpt++;
    console.log('event.tutu : ', event.tutu);
  };

  beforeEach(() => {
    handler = new EventTypeHandler('EventType', callback);
  });

  it(`should show 'EventType' at the begining`, () => {
    expect(handler.toString().indexOf('EventType' + ':')).not.toEqual(-1);
  });

  it(`should show a function compiled in js with no ';'`, () => {
    const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
    const expectedCompiledJsFunction =
      'EventType: ' + ts.transpileModule(String(callback), options).outputText;
    expect(handler.toString()).toEqual(
      expectedCompiledJsFunction.replace(/\);/g, ')').replace(/};/g, '}'),
    );
  });

  it(`should not contains any ');' sequence after toString`, () => {
    expect(handler.toString().indexOf(');')).toEqual(-1);
  });

  it(`should not contains any '};' sequence after toString`, () => {
    expect(handler.toString().indexOf('};')).toEqual(-1);
  });


});
