export class FromStreamSelector {
  constructor(private readonly streamId: string) {}

  public toString(): string {
    return `fromStream("${this.streamId}")`;
  }
}
