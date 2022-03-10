import { ProjectionOptions } from "../options";
import { format } from "prettier";
import {
  FromAllSelector,
  FromCategorySelector,
  FromStreamSelector,
  FromStreamsSelector,
} from "../selectors";
import {
  FilterByFilter,
  ForEachStreamFilter,
  OutputStateFilter,
  PartitionByFilter,
  TransformByFilter,
  WhenFilter,
} from "../filters";
import { GlobalObject } from "./global-object";

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

  globalObjects: Array<GlobalObject> = [];

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
    this.globalObjects.forEach((object: GlobalObject) => {
      let stringifiedMethod = this.isNotAStandardFunction(object)
        ? `const ${object.alias} =  ${object.content}`
        : `${object.content}`;

      if (stringifiedMethod.match("const undefined"))
        stringifiedMethod = stringifiedMethod.replace(
          "const undefined",
          `const ${object.alias}2`
        );

      stringBuilder.push(`
        
        ${stringifiedMethod}
        
        `);
    });
  }

  private isNotAStandardFunction(object: GlobalObject) {
    return !`${object.content.toString()}`.match(/^function/);
  }
}
