# Changelog

### 1.0.8
External object helper added : 
    because the when filter can ship some method calling external method, this were causing an error when exporting the projection. Now, by adding the external method to the  addGlobalObject part of the builder, it's added to the built projection, so it can be used.
```typescript
projectionBuilder
  .addGlobalObject(mergeSlotsHelper)    
```
