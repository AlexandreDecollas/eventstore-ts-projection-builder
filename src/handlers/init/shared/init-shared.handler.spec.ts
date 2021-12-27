import { InitSharedHandler } from './init-shared.handler';
import { ProjectionState } from '../../../builder/projection.state';

class InitialiState extends ProjectionState {
  prop1 = 'toto';
  cpt = 0;
}

describe('InitSharedHandler', () => {
  const handler: InitSharedHandler<InitialiState> =
    new InitSharedHandler<InitialiState>(new InitialiState());
  it('should be able to print the initial state given at startup', () => {
    const state = new InitialiState();
    const stringifiedState = `$initShared: function f() {return ${JSON.stringify(
      state,
    )}}`;
    expect(handler.toString()).toEqual(stringifiedState);
  });
});
