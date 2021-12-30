import {buildEventBusProjection} from './projection2.for-example';

describe('RoomAvailabilityProjection', () => {
  it('should not add function names and extra parameters before emit', () => {

    const projection = buildEventBusProjection();
    expect(projection.indexOf('function jobEndedEventHandler')).toEqual(-1);
    console.log('buildEventBusProjection() : ', projection)
  });

});
