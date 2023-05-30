# microCMS Utilities

## date utility

Get the start and end of the month / day with timezone adjustment

### day

```ts
import { getStartAndEndOfTime } from 'microcms-utils';

const [start, end] = getStartAndEndOfTime('2023-05-01', 9);

// start: 2023-04-30T14:59:59.999Z
// end: 2023-05-01T15:00:00.000Z
```

### month

```ts
import { getStartAndEndOfTime } from 'microcms-utils';

const [start, end] = getStartAndEndOfTime('2023-05', 9);

// start: 2023-04-30T14:59:59.999Z
// end: 2023-05-31T15:00:00.000Z
```

### filter query

```ts
import { getFormattedFilterTimeRange } from 'microcms-utils';

const queryString = getFormattedFilterTimeRange('fieldName', '2023-05', 9);

// fieldName[greater_than]2023-04-30T14:59:59.999Z[and]fieldName[less_than]2023-05-31T15:00:00.000Z
```