import data from '../database/data.json';
import { FluentSQLBuilder } from './FluentSQL.js';

// 2019-12-08T21:52:43+00:00
const result = FluentSQLBuilder.for(data)
  .where({ registered: /^(2020)/ })
  .where({ category: /^(security|developer|quality assurance)$/ })
  .where({ phone: /\((852|850|810|800)\)/ })
  .select(['name', 'company', 'category', 'phone'])
  .orderBy('category')
  .limit(1)
  .build();

console.table(result);