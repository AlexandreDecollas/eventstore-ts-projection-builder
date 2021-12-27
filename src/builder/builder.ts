import {ProjectionOptions} from '../options/projection.options';
import {format} from 'prettier';
import {FromStreamSelector} from '../selectors/from-stream.selector';
import {FromCategorySelector} from '../selectors/from-category.selector';
import {FromAllSelector} from '../selectors/from-all.selector';
import {FromStreamsSelector} from '../selectors/from-streams.selector';
import {TransformByFilter} from '../filters/transform-by.filter';
import {FilterByFilter} from '../filters/filter-by.filter';
import {WhenFilter} from '../filters/when.filter';
import {ForEachStreamFilter} from '../filters/for-each-stream.filter';
import {OutputStateFilter} from '../filters/output-state.filter';
import {PartitionByFilter} from '../filters/partition-by.filter';

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

  public toString(): string {
    const stringBuilder: string[] = [];

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
            | PartitionByFilter,
        ) => stringBuilder.push(filter.toString()),
      );
    }
    const stringifiedProjection = stringBuilder
      .join('')
      .replace(/\(0, .+\.emit\)?/g, '\remit')
      .replace(/\(0, .+\.linkTo\)?/g, '\rlinkTo');

    return format(stringifiedProjection, { parser: 'typescript' });
  }
}
