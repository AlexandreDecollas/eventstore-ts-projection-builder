export class FromStreamsSelector {
  constructor(private readonly streams: string[]) {}

  public toString(): string {
    const formatedStreams = this.streams.map(
      (stream: string): string => `"${stream}"`,
    );
    return `fromStreams(${formatedStreams.join(', ')})`;
  }
}
