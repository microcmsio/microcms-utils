# microCMS Utilities

## date utility

### getAbsoluteTime

You can get the date and time independent of the time zone of the execution environment.

```ts
import { getAbsoluteTime } from 'microcms-utils'

// Local time dependent on execution environment is displayed. ex. UTC Runtime
const dateTime = new Date().toISOString().toLocaleString();
// 2023-06-01T01:14:53.838Z

// Local time in the specified time difference is displayed.
const absoluteDateTime = getAbsoluteTime(new Date().toISOString(), 9).toLocaleString();
// 2023/6/1 10:14:53
```

### getStartAndEndOfTime

You can get a range of dates and months independent of the time zone of the execution environment.

#### day

```ts
import { getStartAndEndOfTime } from 'microcms-utils';

const [start, end] = getStartAndEndOfTime('2023-05-01', 9);

// start: 2023-04-30T14:59:59.999Z
// end: 2023-05-01T15:00:00.000Z
```

#### month

```ts
import { getStartAndEndOfTime } from 'microcms-utils';

const [start, end] = getStartAndEndOfTime('2023-05', 9);

// start: 2023-04-30T14:59:59.999Z
// end: 2023-05-31T15:00:00.000Z
```

### getFormattedFilterTimeRange

You may get a query for filters string.

```ts
import { getFormattedFilterTimeRange } from 'microcms-utils';

const queryString = getFormattedFilterTimeRange('fieldName', '2023-05', 9);

// fieldName[greater_than]2023-04-30T14:59:59.999Z[and]fieldName[less_than]2023-05-31T15:00:00.000Z
```