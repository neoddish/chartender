import { jsonToGraphData } from '../../../src/graph/graphData';
import { miniSuperstore } from '../../../src/presets/data';

describe('UT:jsonToGraphData', () => {
  test('should work', () => {
    // expect(jsonToGraphData(miniSuperstore)).toStrictEqual();
    // console.log(JSON.stringify(jsonToGraphData(miniSuperstore)));
    console.log(jsonToGraphData(miniSuperstore).find((node) => node.shape === 'field-node'));
    console.log(jsonToGraphData(miniSuperstore).find((node) => node.shape === 'dataprop-node'));
  });
});
