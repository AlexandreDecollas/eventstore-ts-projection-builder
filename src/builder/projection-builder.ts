import { ProjectionOptions } from "../options";
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
import { Builder } from "./builder";
import { GlobalObject } from "./global-object";

export class ProjectionBuilder {
  private builder: Builder;

  constructor() {
    this.builder = new Builder();
  }

  public exportProjection(): string {
    return this.builder.toString();
  }

  public addSelector(
    selector:
      | FromAllSelector
      | FromCategorySelector
      | FromStreamSelector
      | FromStreamsSelector
  ): ProjectionBuilder {
    this.builder.selector = selector;
    return this;
  }

  public addOptions(options: ProjectionOptions): ProjectionBuilder {
    this.builder.options = options;
    return this;
  }

  public addFilter(
    filter:
      | WhenFilter
      | ForEachStreamFilter
      | OutputStateFilter
      | TransformByFilter
      | FilterByFilter
      | PartitionByFilter
  ): ProjectionBuilder {
    this.builder.filter.push(filter);
    return this;
  }

  public addGlobalObject(object: GlobalObject): ProjectionBuilder {
    this.builder.globalObjects.push(object);
    return this;
  }
}
