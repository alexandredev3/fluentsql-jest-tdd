import { expect, describe, test } from '@jest/globals';

import { FluentSQLBuilder } from '../src/FluentSQL';

const data = [
  {
    id: 0,
    name: 'alexandre',
    category: 'developer'
  },
  {
    id: 1,
    name: 'sara',
    category: 'makeup artist'
  },
  {
    id: 2,
    name: 'dienifer',
    category: 'manager'
  },
]

describe('Test Suite for FluentSQL Builder', () => {
  test('#for should return a FluentSQLBuilder instance', () => {
    // validando instancias.

    const result = FluentSQLBuilder.for(data);
    const expected = new FluentSQLBuilder(data);

    // toStrictEqual verifica "a nivel mais fundo" do objeto.
    expect(expected).toStrictEqual(result);
  })
  test('#build should return the object instance', () => {
    const result = FluentSQLBuilder.for(data).build();
    const expected = data;

    expect(expected).toStrictEqual(result);
  })

  test('#limit given a collection it should limit results', () => {
    const result = FluentSQLBuilder.for(data).limit(1).build();
    const expected = [data[0]];

    expect(expected).toStrictEqual(result);
  })
  test('#where given a collection it should filter data', () => {
    const result = FluentSQLBuilder.for(data).where({
      category: /^dev/
    }).build();
    const expected = data.filter(({ category }) => category.slice(0, 3) === 'dev');

    expect(expected).toStrictEqual(result);
  })
  test('#select given a collection it should return only specific fields', () => {
    const result = FluentSQLBuilder.for(data)
      .select(['name', 'category'])
      .build();

    const expected = data.map(({ name, category }) => ({ name, category }));

    expect(expected).toStrictEqual(result);
  })
  test('#orderBy given a collection it should order results by field', () => {
    const result = FluentSQLBuilder.for(data)
      .orderBy('name')
      .build();

    const expected = [
      {
        id: 0,
        name: 'alexandre',
        category: 'developer'
      },
      {
        id: 2,
        name: 'dienifer',
        category: 'manager'
      },
      {
        id: 1,
        name: 'sara',
        category: 'makeup artist'
      },
    ];

    expect(expected).toStrictEqual(result);
  })

  // chamar todos de uma vez.
  test('pipeline', () => {
    const result = FluentSQLBuilder.for(data)
      .where({ name: /^a/ })
      .select(['name', 'category'])
      .orderBy('name')
      .build();
      
    const expected = data.filter(({ id }) => id === 0)
      .map(({ name, category }) => ({ name, category }));

    expect(expected).toStrictEqual(result);
  })
});