import fs from 'fs';
import path from 'path';
import { TestModelBoundary } from './model-boundary';
import type { Analysis } from './model-boundary';
import { fixtureResponses } from './fixture-responses';

export class FixtureLoader {
  private fixtures: Map<string, Analysis> = new Map();

  constructor() {
    this.loadFixtures();
  }

  private loadFixtures() {
    // Load fixture files
    const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures');

    try {
      const contractWithClausesPath = path.join(fixturesDir, 'contract-with-clauses.txt');
      const contractCleanPath = path.join(fixturesDir, 'contract-clean.txt');

      if (fs.existsSync(contractWithClausesPath)) {
        const text = fs.readFileSync(contractWithClausesPath, 'utf-8');
        this.fixtures.set(text.substring(0, 50), fixtureResponses['contract-with-clauses']());
      }

      if (fs.existsSync(contractCleanPath)) {
        const text = fs.readFileSync(contractCleanPath, 'utf-8');
        this.fixtures.set(text.substring(0, 50), fixtureResponses['contract-clean']());
      }
    } catch (error) {
      console.warn('Failed to load fixture files:', error);
    }
  }

  createTestModelBoundary(): TestModelBoundary {
    const fixtureMapping: { [key: string]: { analysis?: Analysis } } = {};

    // Add fixture responses keyed by document text prefix
    for (const [key, analysis] of this.fixtures.entries()) {
      fixtureMapping[`analyze:${key}`] = { analysis };
    }

    // Also add by known fixture names as fallback
    const clausesAnalysis = fixtureResponses['contract-with-clauses']();
    const cleanAnalysis = fixtureResponses['contract-clean']();

    // Map by recognizable text from fixtures
    fixtureMapping[`analyze:MASTER SERVICE AGREEMENT`] = { analysis: clausesAnalysis };
    fixtureMapping[`analyze:SOFTWARE SERVICES AGREEMENT`] = { analysis: cleanAnalysis };

    return new TestModelBoundary(fixtureMapping);
  }
}

export function createTestBoundary(): TestModelBoundary {
  const loader = new FixtureLoader();
  return loader.createTestModelBoundary();
}
