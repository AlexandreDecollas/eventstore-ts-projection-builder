import {emit, EventTypeHandler, FromStreamsSelector, ProjectionBuilder, WhenFilter} from '../src';

function jobStartedEventHandler(state, event: any): void {
  const shopId = event.data.shopId;
  const startedAt = event.data.startedAt;
  const correlationId = event.metadata.$correlationId;
  const streamId = `analytics_accounts_sync-${shopId}`;
  const body = {
    shopId,
    date: new Date(startedAt).getTime(), // Using timestamp to avoid breaking retro compatibility.
  };
  // Adding metadata to the version 2
  const metadata = {
    version: 2,
    created_at: new Date().toISOString(),
    $correlationId: correlationId,
  };
  emit(streamId, 'MetricsSyncStartedEvent', body, metadata);
}
function jobEndedEventHandler(state, event: any): void {
  const shopId = event.data.shopId;
  const startedAt = event.data.startedAt;
  const correlationId = event.metadata.$correlationId;
  const streamId = `analytics_accounts_sync-${shopId}`;
  const body = {
    shopId,
    date: new Date(startedAt).getTime(), // Using timestamp to avoid breaking retro compatibility.
  };
  // Adding metadata to the version 2
  const metadata = {
    version: 2,
    created_at: new Date().toISOString(),
    $correlationId: correlationId,
  };
  emit(streamId, 'MetricsLastSyncEvent', body, metadata);
}
export function buildEventBusProjection(): string {
  const projectionBuilder: ProjectionBuilder = new ProjectionBuilder();
  return projectionBuilder
    .addSelector(new FromStreamsSelector(['$et-JobStartedEvent', '$et-JobEndedEvent']))
    .addFilter(
      new WhenFilter([
        new EventTypeHandler('JobStartedEvent', jobStartedEventHandler),
        new EventTypeHandler('JobEndedEvent', jobEndedEventHandler),
      ]),
    )
    .exportProjection();
}
console.log(buildEventBusProjection());
