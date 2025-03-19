import serializeJavascript from 'serialize-javascript';

export class ProjectionState {
  public toString(): string {
    return serializeJavascript(this);
  }
}
