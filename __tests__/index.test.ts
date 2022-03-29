import { version } from '../package.json';

describe('init test', () => {
  test('get version right', () => {
    expect(version).toBe('0.1.0'); // 实际的版本号从你设置的当前 package.json 里看
  });
});
