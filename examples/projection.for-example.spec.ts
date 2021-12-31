import {
  BookedRoomsState,
  buildRoomAvailabilityProjection,
  roomAddedEventHandlerCallBack,
  RoomBookedEvent,
  roomBookedEventHandlerCallBack
} from './projection.for-example';

describe('RoomAvailabilityProjection', () => {
  it('A console.log example', () => {
    const projection = buildRoomAvailabilityProjection();

    console.log('Built projection : ', projection)
  });

  let state: BookedRoomsState;

  beforeEach(() => {
    state = new BookedRoomsState();
    roomAddedEventHandlerCallBack(state, {
      metadata: { streamName: 'manager.room-added' },
      type: 'RoomAddedEvent',
      data: { id: '', roomNumber: 123 },
    });
  });

  it('should add the booked slots when intersection is null', () => {
    const event1: RoomBookedEvent = getEvent(1, 12, 2021, 10, 12, 2021);
    const event2: RoomBookedEvent = getEvent(12, 12, 2021, 13, 12, 2021);

    roomBookedEventHandlerCallBack(state, event1);
    roomBookedEventHandlerCallBack(state, event2);

    expect(state.rooms[123].slots[0].dateFrom.day).toEqual(1);
    expect(state.rooms[123].slots[0].dateTo.day).toEqual(10);
    expect(state.rooms[123].slots[1].dateFrom.day).toEqual(12);
    expect(state.rooms[123].slots[1].dateTo.day).toEqual(13);
  });

  it('should merge the booked slots when possible', () => {
    const event1: RoomBookedEvent = getEvent(1, 12, 2021, 10, 12, 2021);
    const event2: RoomBookedEvent = getEvent(10, 12, 2021, 13, 12, 2021);

    roomBookedEventHandlerCallBack(state, event1);
    roomBookedEventHandlerCallBack(state, event2);

    expect(state.rooms[123].slots.length).toEqual(1);
    expect(state.rooms[123].slots[0].dateFrom.day).toEqual(1);
    expect(state.rooms[123].slots[0].dateTo.day).toEqual(13);
  });

  it('should merge the booked slots when possible and just push a new when not possible', () => {
    const event1: RoomBookedEvent = getEvent(1, 12, 2021, 2, 12, 2021);
    const event2: RoomBookedEvent = getEvent(5, 12, 2021, 7, 12, 2021);
    const event3: RoomBookedEvent = getEvent(8, 12, 2021, 13, 12, 2021);

    roomBookedEventHandlerCallBack(state, event1);
    roomBookedEventHandlerCallBack(state, event2);
    roomBookedEventHandlerCallBack(state, event3);

    expect(state.rooms[123].slots.length).toEqual(2);

    expect(state.rooms[123].slots[0].dateFrom.day).toEqual(1);
    expect(state.rooms[123].slots[0].dateTo.day).toEqual(2);

    expect(state.rooms[123].slots[1].dateFrom.day).toEqual(5);
    expect(state.rooms[123].slots[1].dateTo.day).toEqual(13);
  });
});
const getEvent = (
  dayFrom: number,
  monthFrom: number,
  yearFrom: number,
  dayTo: number,
  monthTo: number,
  yearTo: number,
): RoomBookedEvent => {
  return {
    metadata: { streamName: 'manager.room-added' },
    type: 'RoomBookedEvent',
    data: {
      id: 'AZE',
      roomNumber: 123,
      occupiedFromDate: {
        year: yearFrom,
        month: monthFrom,
        day: dayFrom,
      },
      occupiedUntilDate: {
        year: yearTo,
        month: monthTo,
        day: dayTo,
      },
    },
  };
};
