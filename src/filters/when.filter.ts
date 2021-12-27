export class WhenFilter {
  constructor(private readonly handlers: any[]) {}

  public toString(): string {
    const stringBuilder: string[] = [`.when({`];
    stringBuilder.push(
      this.handlers.map((handler) => handler.toString()).join(','),
    );
    stringBuilder.push(`})`);
    return stringBuilder.join('');
  }
}
