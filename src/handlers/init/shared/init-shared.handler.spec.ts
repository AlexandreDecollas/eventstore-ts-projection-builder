import { InitSharedHandler } from './init-shared.handler';
import { ProjectionState } from '../../../builder/projection.state';
import serializeJavascript from 'serialize-javascript';

class InitialiState extends ProjectionState {
  prop1: string = 'toto';
  cpt: number = 0;
  bigInt: bigint = BigInt(9007199254740991);
}

describe('InitSharedHandler', () => {
  const handler: InitSharedHandler<InitialiState> =
    new InitSharedHandler<InitialiState>(new InitialiState());

  it('should be able to print the initial state given at startup', () => {
    const state: InitialiState = new InitialiState();

    const stringifiedState: string = `$initShared: function f() {return ${serializeJavascript(state)}}`;

    expect(handler.toString()).toEqual(stringifiedState);
  });
});
