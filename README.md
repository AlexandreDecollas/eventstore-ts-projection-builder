# Eventstore : typescript projection builder

The aim of this lib is to give a helper for building eventstore projections using the strength of ts.

This lib is based on [this official documentation page](https://developers.eventstore.com/server/v21.6/projections/user-defined-projections.html) 

## How to build a projection
A first example will be very explicit :
```typescript
export const buildRoomAvailabilityProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const bookedRoomsState: BookedRoomsState = new BookedRoomsState();

  return projectionBuilder
    .addSelector(
      new FromStreamsSelector(['manager.room-added', 'guest.room-booked']),
    )
    .addFilter(
      new WhenFilter([
        new InitHandler(bookedRoomsState),
        new EventTypeHandler('RoomAddedEvent', roomAddedEventHandlerCallBack),
        new EventTypeHandler('RoomBookedEvent', roomBookedEventHandlerCallBack),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};
```
As you can see on this peace of code, you just have to declare a builder method. This method will use a `ProjectionBuilder` object that will aggregate all projection elements you need. 

The result of `buildRoomAvailabilityProjection()` will be the projection as string, ready to be upserted into eventstore. The code produced corresponds to the typescript callbacks compiled in js and cleaned with prettier. So it's highly readable, and easy to debug in the eventstore interface if needed.

Assuming that you already know how to build a projection, and what is a selector, a filter etc (yet based on [the doc](https://developers.eventstore.com/server/v21.6/projections/user-defined-projections.html)), here is the list of each projection element available in this lib : 

The list of selectors : 
```text
FromAllSelector
FromCategorySelector
FromStreamSelector
FromStreamsSelector
```

The list of filters : 
```text
FilterByFilter
ForEachStreamFilter
OutputStateFilter
PartitionByFilter
TransformByFilter
WhenFilter
```

The handlers : 
```text
InitHandler
InitSharedHandler
EventTypeHandler
DeletedTypeHandler
AnyHandler
```

The options properties : 
```typescript
export interface ProjectionOptionsModel {
  resultStreamName?: string;
  $includeLinks?: boolean;
  processingLag?: number;
  reorderEvents?: boolean;
}
```

You can add linkTo or emit method into your callbacks by using the given ones of the lib.

The main advantage of this way to do is that you can type your callbacks and test it easily. For example in [the example given](./examples/projection.builder.spec.ts), the state, the events and the callbacks are fully typed, and you can add the structures you want. That makes the projection highly maintainable.
This example is volontary a bit complex, to show that this lib allows to use custom structures thanks to typescript, that would have been hard to use in pure js because of absence of types.


A full and very trivial example of projection : 

```typescript
export class CheckInState {
  guests: string[] = [];
}

export const guestRegisteredEventCallBack = (
  state: CheckInState,
  event: RegisteredEvent,
): void => {
  for (let i = 0; i < state.guests.length; i++) {
    if (state.guests[i] === event.data.clientName) {
      return;
    }
  }
  state.guests.push(event.data.clientName);
};

export const buildRegisteredGuestsProjection = (): string => {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  const checkInStateState: CheckInState = new CheckInState();

  return projectionBuilder
    .addSelector(new FromStreamsSelector(['guest.registered']))
    .addFilter(
      new WhenFilter([
        new InitHandler(checkInStateState),
        new EventTypeHandler('RegisteredEvent', guestRegisteredEventCallBack),
      ]),
    )
    .addFilter(new OutputStateFilter())
    .exportProjection();
};
```

This will produce a projection string like this : 
```js
fromStreams("guest.registered")
  .when({
    $init: function () {
      return { guests: [] };
    },
    RegisteredEvent: function (state, event) {
      for (var i = 0; i < state.guests.length; i++) {
        if (state.guests[i] === event.data.clientName) {
          return;
        }
      }
      state.guests.push(event.data.clientName);
    },
  })
  .outputState(); 
```
