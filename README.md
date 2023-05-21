# microCMS Utilities

## date utility

Get the start and end of the month / day with timezone adjustment

```ts
import { getStartAndEndOfTime } from 'microcms-utils';

const [start, end] = getStartAndEndOfTime('2023-05-01', 9);

// start: 2023-04-30T14:59:59.999Z
// end: 2023-05-01T15:00:00.000Z
```
