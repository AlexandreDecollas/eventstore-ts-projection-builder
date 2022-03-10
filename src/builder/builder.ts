import {ProjectionOptions} from "../options";
import {format} from "prettier";
import {FromAllSelector, FromCategorySelector, FromStreamSelector, FromStreamsSelector} from "../selectors";
import {
  FilterByFilter,
  ForEachStreamFilter,
  OutputStateFilter,
  PartitionByFilter,
  TransformByFilter,
  WhenFilter
} from "../filters";

export class Builder {
  selector?:
    | FromAllSelector
    | FromCategorySelector
    | FromStreamSelector
    | FromStreamsSelector;

  options?: ProjectionOptions;

  filter: Array<
    | WhenFilter
    | ForEachStreamFilter
    | OutputStateFilter
    | TransformByFilter
    | FilterByFilter
    | PartitionByFilter
  > = [];

  globalObjects: Array<any> = [];

  public toString(): string {
    const stringBuilder: string[] = [];
    this.stringifyHelpers(stringBuilder);

    if (this.options) {
      stringBuilder.push(this.options.toString());
    }

    if (this.selector) {
      stringBuilder.push(this.selector.toString());
    }

    if (this.filter) {
      this.filter.forEach(
        (
          filter:
            | WhenFilter
            | ForEachStreamFilter
            | OutputStateFilter
            | TransformByFilter
            | FilterByFilter
            | PartitionByFilter
        ) => stringBuilder.push(filter.toString())
      );
    }
    const stringifiedProjection = stringBuilder.join("");

    return format(stringifiedProjection, { parser: "typescript" });
  }

  private stringifyHelpers(stringBuilder: string[]): void {
    if (!this.globalObjects) {
      return;
    }
    this.globalObjects.forEach((object: any) => {
      const stringifiedMethod = this.isNotAStandardFunction(object)
        ? `const ${object.name} =  ${object}`
        : `${object}`;
      stringBuilder.push(`
        
        ${stringifiedMethod}
        
        `);
    });
  }

  private isNotAStandardFunction(object: any) {
    return !`${object.toString()}`.match(/^function/);
  }
}
