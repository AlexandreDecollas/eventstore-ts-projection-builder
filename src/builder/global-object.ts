import serializeJavascript from 'serialize-javascript';

export class GlobalObject {
  constructor(
    private readonly alias: string,
    private readonly content: any,
    private readonly type?: "array" | "string"
  ) {}

  public toString(): string {
    if (this.type) {
      return this.addSpacing(
        `const ${this.alias} =  ${serializeJavascript(this.content)}`
      );
    }

    let printableContent: string = this.isNotAStandardFunction()
      ? `const ${this.alias} =  ${this.content}`
      : `${this.content}`;

    if (printableContent.match("const undefined"))
      printableContent = printableContent.replace(
        "const undefined",
        `const ${this.alias}`
      );
    return this.addSpacing(printableContent);
  }

  private addSpacing(content: string): string {
    return `
        
        ${content}

        `;
  }

  private isNotAStandardFunction() {
    return !`${this.content.toString()}`.match(/^function/);
  }
}
