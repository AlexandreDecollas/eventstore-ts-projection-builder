import { InitHandler } from './init.handler';
import { ProjectionState } from '../../../builder';
import serializeJavascript from 'serialize-javascript';

class InitialiState extends ProjectionState {
  prop1 = 'toto';
  cpt = 0;
}

describe('InitHandler', () => {
  const state: InitialiState = new InitialiState();
  const handler: InitHandler<InitialiState> = new InitHandler<InitialiState>(
    state,
  );
  it('should be able to print the initial state given at startup', () => {
    const stringifiedState = `$init: function () {return ${serializeJavascript(
      state,
    )}}`;
    expect(handler.toString()).toEqual(stringifiedState);
  });
});
