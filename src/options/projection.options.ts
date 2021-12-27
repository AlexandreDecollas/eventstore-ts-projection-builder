export interface ProjectionOptionsModel {
  resultStreamName?: string;
  $includeLinks?: boolean;
  processingLag?: number;
  reorderEvents?: boolean;
}

export class ProjectionOptions {
  constructor(private readonly options: ProjectionOptionsModel) {}

  public toString(): string {
    return `options({${
      this.options['resultStreamName'] !== undefined
        ? `resultStreamName: '${this.options.resultStreamName}',`
        : ''
    }${
      this.options['$includeLinks'] !== undefined
        ? `$includeLinks: ${this.options.$includeLinks},`
        : ''
    }${
      this.options['processingLag'] !== undefined
        ? `processingLag: ${this.options.processingLag},`
        : ''
    }${
      this.options['reorderEvents'] !== undefined
        ? `reorderEvents: ${this.options.reorderEvents},`
        : ''
    }});`;
  }
}
