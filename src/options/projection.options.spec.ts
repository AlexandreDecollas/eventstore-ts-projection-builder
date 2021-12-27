import { ProjectionOptions } from './projection.options';

describe('Projection Options', () => {
  let options: ProjectionOptions;

  it('should show all options event when option is false', () => {
    options = new ProjectionOptions({
      resultStreamName: 'my_demo_projection_result',
      $includeLinks: false,
      reorderEvents: false,
      processingLag: 0,
    });

    expect(options.toString()).toEqual(
      `options({resultStreamName: 'my_demo_projection_result',$includeLinks: false,processingLag: 0,reorderEvents: false,});`,
    );
  });

  it('should only show given options', () => {
    options = new ProjectionOptions({
      resultStreamName: 'my_demo_projection_result',
      $includeLinks: false,
    });
    expect(options.toString()).toEqual(
      `options({resultStreamName: 'my_demo_projection_result',$includeLinks: false,});`,
    );
  });
});
