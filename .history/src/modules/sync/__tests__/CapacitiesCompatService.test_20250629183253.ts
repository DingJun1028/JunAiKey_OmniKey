import { importFromCapacities, exportToCapacities } from '../CapacitiesCompatService';

describe('CapacitiesCompatService', () => {
  it('should import data from Capacities format', async () => {
    const dummyData = { records: [{ content: 'test' }] };
    const result = await importFromCapacities(dummyData);
    expect(result.success).toBe(true);
  });

  it('should export data to Capacities format', async () => {
    const result = await exportToCapacities();
    expect(result.records).toBeDefined();
    expect(Array.isArray(result.records)).toBe(true);
  });
});
