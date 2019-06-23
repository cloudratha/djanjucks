import djanjucks from '../../src';

describe('debug tag', () => {
  it('outputs the context', () => {
    const result = djanjucks.renderString('{% debug %}', {
      items: ['A', 'B', 'C'],
      date: new Date('01-01-2019'),
      object: {
        key: 'value'
      },
      number: 100,
      bool: true
    });

    expect(result).toMatchSnapshot();
  });
});
