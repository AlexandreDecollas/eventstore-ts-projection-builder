export class FromCategorySelector {
  constructor(private readonly category: string) {}

  public toString(): string {
    return `fromCategory("${this.category}")`;
  }
}
