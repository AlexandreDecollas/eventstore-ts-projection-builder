# Changelog

### 1.0.9
Now you can specify the type and alias of external variables when using one :
```typescript
import {GlobalObject} from './global-object';
import {EXTERNAL_VALUE, EXTERNAL_VALUES} from './projection-builder.spec.helper';

projectionBuilder
  .addGlobalObject(new GlobalObject('EXTERNAL_CONSTANT', EXTERNAL_VALUE))
  .addGlobalObject(new GlobalObject('EXTERNAL_CONSTANT_ARRAY', EXTERNAL_VALUES, 'array'))    
```

### 1.0.8
External object helper added : 
    because the when filter can ship some method calling external method, this were causing an error when exporting the projection. Now, by adding the external method to the  addGlobalObject part of the builder, it's added to the built projection, so it can be used.
```typescript
projectionBuilder
  .addGlobalObject(mergeSlotsHelper)    
```
