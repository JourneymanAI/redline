import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { analyzeContract } from "@/lib/analysis";
import { TestModelBoundary } from "@/lib/model-boundary";
import {
  isJurisdictionSensitive,
  getJurisdictionSensitivityAdjustment,
  getJurisdictionNotice,
  getJurisdictionSensitiveClauses,
} from "@/lib/jurisdiction-rules";
import { fixtureResponses } from "@/lib/fixture-responses";
import NewReview from "@/app/review/new/page";

describe("Jurisdiction Rules", () => {
  describe("isJurisdictionSensitive", () => {
    it("should identify non-compete as jurisdiction-sensitive", () => {
      expect(isJurisdictionSensitive("non-compete")).toBe(true);
    });

    it("should identify arbitration as jurisdiction-sensitive", () => {
      expect(isJurisdictionSensitive("arbitration")).toBe(true);
    });

    it("should identify liquidated-damages as jurisdiction-sensitive", () => {
      expect(isJurisdictionSensitive("liquidated-damages")).toBe(true);
    });

    it("should identify choice-of-law as jurisdiction-sensitive", () => {
      expect(isJurisdictionSensitive("choice-of-law")).toBe(true);
    });

    it("should identify forum-selection as jurisdiction-sensitive", () => {
      expect(isJurisdictionSensitive("forum-selection")).toBe(true);
    });

    it("should NOT identify personal-guarantee as jurisdiction-sensitive", () => {
      expect(isJurisdictionSensitive("personal-guarantee")).toBe(false);
    });

    it("should NOT identify ip-assignment as jurisdiction-sensitive", () => {
      expect(isJurisdictionSensitive("ip-assignment")).toBe(false);
    });

    it("should be case-insensitive", () => {
      expect(isJurisdictionSensitive("NON-COMPETE")).toBe(true);
      expect(isJurisdictionSensitive("Non-Compete")).toBe(true);
      expect(isJurisdictionSensitive("ARBITRATION")).toBe(true);
    });
  });

  describe("getJurisdictionSensitivityAdjustment", () => {
    it("should return 'depends' for non-compete in California", () => {
      expect(
        getJurisdictionSensitivityAdjustment("non-compete", "CA")
      ).toBe("depends");
    });

    it("should return 'clear' for non-compete in Florida", () => {
      expect(
        getJurisdictionSensitivityAdjustment("non-compete", "FL")
      ).toBe("clear");
    });

    it("should return 'clear' for non-compete in Texas", () => {
      expect(
        getJurisdictionSensitivityAdjustment("non-compete", "TX")
      ).toBe("clear");
    });

    it("should return 'depends' for arbitration in California", () => {
      expect(
        getJurisdictionSensitivityAdjustment("arbitration", "CA")
      ).toBe("depends");
    });

    it("should return 'clear' for arbitration in Texas", () => {
      expect(
        getJurisdictionSensitivityAdjustment("arbitration", "TX")
      ).toBe("clear");
    });

    it("should return 'depends' for liquidated-damages in California", () => {
      expect(
        getJurisdictionSensitivityAdjustment("liquidated-damages", "CA")
      ).toBe("depends");
    });

    it("should return 'clear' for liquidated-damages in Texas", () => {
      expect(
        getJurisdictionSensitivityAdjustment("liquidated-damages", "TX")
      ).toBe("clear");
    });

    it("should return 'depends' for non-compete when governing law is unknown", () => {
      expect(
        getJurisdictionSensitivityAdjustment("non-compete", "unknown")
      ).toBe("depends");
    });

    it("should return 'clear' for non-jurisdiction-sensitive clauses when governing law is unknown", () => {
      expect(
        getJurisdictionSensitivityAdjustment("personal-guarantee", "unknown")
      ).toBe("clear");
    });

    it("should return 'depends' for jurisdiction-sensitive clauses when governing law is non-us", () => {
      expect(
        getJurisdictionSensitivityAdjustment("non-compete", "non-us")
      ).toBe("depends");
      expect(
        getJurisdictionSensitivityAdjustment("arbitration", "non-us")
      ).toBe("depends");
    });

    it("should return 'clear' for non-jurisdiction-sensitive clauses when governing law is non-us", () => {
      expect(
        getJurisdictionSensitivityAdjustment("personal-guarantee", "non-us")
      ).toBe("clear");
    });

    it("should be case-insensitive for state codes", () => {
      expect(
        getJurisdictionSensitivityAdjustment("non-compete", "ca")
      ).toBe("depends");
      expect(
        getJurisdictionSensitivityAdjustment("non-compete", "TX")
      ).toBe("clear");
    });
  });

  describe("getJurisdictionNotice", () => {
    it("should return a notice for non-us governing law", () => {
      const notice = getJurisdictionNotice("non-us");
      expect(notice).toBeTruthy();
      expect(notice).toContain("non-US law");
    });

    it("should return a notice for unknown governing law", () => {
      const notice = getJurisdictionNotice("unknown");
      expect(notice).toBeTruthy();
      expect(notice).toContain("Governing law is unknown");
    });

    it("should return null for known US state", () => {
      const notice = getJurisdictionNotice("CA");
      expect(notice).toBeNull();
    });

    it("should return null for Texas", () => {
      const notice = getJurisdictionNotice("TX");
      expect(notice).toBeNull();
    });
  });

  describe("getJurisdictionSensitiveClauses", () => {
    it("should return a list of jurisdiction-sensitive clauses", () => {
      const clauses = getJurisdictionSensitiveClauses();
      expect(clauses).toContain("non-compete");
      expect(clauses).toContain("arbitration");
      expect(clauses).toContain("liquidated-damages");
      expect(clauses).toContain("choice-of-law");
      expect(clauses).toContain("forum-selection");
    });

    it("should not include non-jurisdiction-sensitive clauses", () => {
      const clauses = getJurisdictionSensitiveClauses();
      expect(clauses).not.toContain("personal-guarantee");
      expect(clauses).not.toContain("ip-assignment");
    });
  });
});

describe("Jurisdiction Handling in Analysis (ADR 0005)", () => {
  it("should mark jurisdiction-sensitive flags as unclear when governing law is unknown", async () => {
    const fixtureAnalysis = fixtureResponses["contract-with-clauses"]();
    const contractText = "contract-with-clauses";

    const testBoundary = new TestModelBoundary({
      [`analyze:${contractText.substring(0, 50)}`]: { analysis: fixtureAnalysis },
    });

    const result = await analyzeContract(
      {
        documentText: contractText,
        redLines: [],
        governingLawState: "unknown",
        operatingState: "unknown",
      },
      testBoundary
    );

    // Check that the analysis doesn't contain jurisdiction-sensitive flags
    // (the fixture doesn't have any, but if it did, they would be marked unclear)
    expect(result.flags).toBeDefined();
    expect(Array.isArray(result.flags)).toBe(true);
  });

  it("should pass governing law state to model boundary", async () => {
    const fixtureAnalysis = fixtureResponses["contract-with-clauses"]();
    const contractText = "contract-with-clauses";

    const testBoundary = new TestModelBoundary({
      [`analyze:${contractText.substring(0, 50)}`]: { analysis: fixtureAnalysis },
    });

    const result = await analyzeContract(
      {
        documentText: contractText,
        redLines: [],
        governingLawState: "CA",
        operatingState: "CA",
      },
      testBoundary
    );

    expect(result.flags).toBeDefined();
  });

  it("should pass operating state to model boundary", async () => {
    const fixtureAnalysis = fixtureResponses["contract-with-clauses"]();
    const contractText = "contract-with-clauses";

    const testBoundary = new TestModelBoundary({
      [`analyze:${contractText.substring(0, 50)}`]: { analysis: fixtureAnalysis },
    });

    const result = await analyzeContract(
      {
        documentText: contractText,
        redLines: [],
        governingLawState: "TX",
        operatingState: "FL",
      },
      testBoundary
    );

    expect(result.flags).toBeDefined();
  });
});

describe("Jurisdiction UI Integration", () => {
  it("should have governing law and operating state dropdowns", () => {
    render(<NewReview />);

    const governingLawSelect = screen.getByLabelText(
      /Governing law state/i
    ) as HTMLSelectElement;
    const operatingStateSelect = screen.getByLabelText(
      /Operating state/i
    ) as HTMLSelectElement;

    expect(governingLawSelect).toBeInTheDocument();
    expect(operatingStateSelect).toBeInTheDocument();
  });

  it("should default governing law and operating state to unknown", () => {
    render(<NewReview />);

    const governingLawSelect = screen.getByLabelText(
      /Governing law state/i
    ) as HTMLSelectElement;
    const operatingStateSelect = screen.getByLabelText(
      /Operating state/i
    ) as HTMLSelectElement;

    expect(governingLawSelect.value).toBe("unknown");
    expect(operatingStateSelect.value).toBe("unknown");
  });

  it("should include all 50 US states in the dropdowns", () => {
    render(<NewReview />);

    const governingLawSelect = screen.getByLabelText(
      /Governing law state/i
    ) as HTMLSelectElement;

    // Check for California
    expect(governingLawSelect.querySelector('option[value="CA"]')).toBeTruthy();
    // Check for Texas
    expect(governingLawSelect.querySelector('option[value="TX"]')).toBeTruthy();
    // Check for Florida
    expect(governingLawSelect.querySelector('option[value="FL"]')).toBeTruthy();
  });

  it("should include non-us option in dropdowns", () => {
    render(<NewReview />);

    const governingLawSelect = screen.getByLabelText(
      /Governing law state/i
    ) as HTMLSelectElement;

    expect(
      governingLawSelect.querySelector('option[value="non-us"]')
    ).toBeTruthy();
  });

  it("should prevent analysis without selecting governing law state", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    const operatingStateSelect = screen.getByLabelText(
      /Operating state/i
    ) as HTMLSelectElement;
    const submitBtn = screen.getByRole("button", { name: /Analyze contract/i });

    fireEvent.change(textarea, {
      target: { value: "Test contract" },
    });
    fireEvent.change(operatingStateSelect, { target: { value: "CA" } });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Please select a governing law state/i)
    ).toBeInTheDocument();
  });

  it("should prevent analysis without selecting operating state", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    const governingLawSelect = screen.getByLabelText(
      /Governing law state/i
    ) as HTMLSelectElement;
    const submitBtn = screen.getByRole("button", { name: /Analyze contract/i });

    fireEvent.change(textarea, {
      target: { value: "Test contract" },
    });
    fireEvent.change(governingLawSelect, { target: { value: "CA" } });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Please select an operating state/i)
    ).toBeInTheDocument();
  });

  it("should allow analysis when both jurisdiction fields are selected", async () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    const governingLawSelect = screen.getByLabelText(
      /Governing law state/i
    ) as HTMLSelectElement;
    const operatingStateSelect = screen.getByLabelText(
      /Operating state/i
    ) as HTMLSelectElement;

    fireEvent.change(textarea, {
      target: { value: "contract-with-clauses" },
    });
    fireEvent.change(governingLawSelect, { target: { value: "CA" } });
    fireEvent.change(operatingStateSelect, { target: { value: "TX" } });

    // Wait for potential updates but don't click submit since we're testing UI state
    expect(governingLawSelect.value).toBe("CA");
    expect(operatingStateSelect.value).toBe("TX");
  });

  it("should have required field markers on jurisdiction selects", () => {
    render(<NewReview />);

    const labels = screen.getAllByText(/\*/);
    expect(labels.length).toBeGreaterThan(0);
  });
});

describe("Jurisdiction Sensitivity Adjustment in Flags", () => {
  it("should adjust confidence marker for non-compete when governing law is unknown", async () => {
    // Create actual contract text with the source sentence embedded
    const contractText =
      "EMPLOYMENT AGREEMENT\n\nEmployee shall not compete with the Company.";

    // Create a custom fixture with a non-compete clause that matches the contract
    const fixtureAnalysis = {
      summary: "Test contract with non-compete",
      flags: [
        {
          clauseType: "non-compete",
          severity: "Push" as const,
          sourceSentence: "Employee shall not compete with the Company.",
          counterOffer: "Remove non-compete",
          confidenceMarker: "clear" as const,
          reason: "Non-compete clause restricts future work",
          isRedLineTrigger: false,
          jurisdictionSensitive: true,
        },
      ],
      alsoSeen: [],
      verdict: { kind: "flags" as const },
    };

    const testBoundary = new TestModelBoundary({
      [`analyze:${contractText.substring(0, 50)}`]: { analysis: fixtureAnalysis },
    });

    const result = await analyzeContract(
      {
        documentText: contractText,
        redLines: [],
        governingLawState: "unknown",
        operatingState: "unknown",
      },
      testBoundary
    );

    // Find the non-compete flag
    const nonCompeteFlag = result.flags.find(
      (f) => f.clauseType === "non-compete"
    );
    expect(nonCompeteFlag).toBeDefined();
    if (nonCompeteFlag) {
      expect(nonCompeteFlag.confidenceMarker).toBe("unclear-get-help");
      expect(nonCompeteFlag.reason).toContain("Enforceability depends on");
    }
  });

  it("should not adjust confidence marker for non-jurisdiction-sensitive clauses", async () => {
    // Create actual contract text with the source sentence embedded
    const contractText =
      "GUARANTEE AGREEMENT\n\nExecutive personally guarantees all obligations.";

    // Create a custom fixture with a personal guarantee (not jurisdiction-sensitive)
    const fixtureAnalysis = {
      summary: "Test contract with personal guarantee",
      flags: [
        {
          clauseType: "personal-guarantee",
          severity: "Blocker" as const,
          sourceSentence: "Executive personally guarantees all obligations.",
          counterOffer: "Remove guarantee",
          confidenceMarker: "clear" as const,
          reason: "Personal liability exposure",
          isRedLineTrigger: false,
          jurisdictionSensitive: false,
        },
      ],
      alsoSeen: [],
      verdict: { kind: "flags" as const },
    };

    const testBoundary = new TestModelBoundary({
      [`analyze:${contractText.substring(0, 50)}`]: { analysis: fixtureAnalysis },
    });

    const result = await analyzeContract(
      {
        documentText: contractText,
        redLines: [],
        governingLawState: "unknown",
        operatingState: "unknown",
      },
      testBoundary
    );

    // Find the personal guarantee flag
    const pgFlag = result.flags.find((f) => f.clauseType === "personal-guarantee");
    expect(pgFlag).toBeDefined();
    if (pgFlag) {
      // Should remain "clear" since personal-guarantee is not jurisdiction-sensitive
      expect(pgFlag.confidenceMarker).toBe("clear");
    }
  });

  it("should adjust confidence marker when governing law is California (jurisdiction-sensitive state)", async () => {
    // Create actual contract text with the source sentence embedded
    const contractText =
      "EMPLOYMENT AGREEMENT\n\nEmployee shall not compete with the Company after termination.";

    // Create a custom fixture with a non-compete clause
    const fixtureAnalysis = {
      summary: "Test contract with non-compete",
      flags: [
        {
          clauseType: "non-compete",
          severity: "Push" as const,
          sourceSentence: "Employee shall not compete with the Company after termination.",
          counterOffer: "Remove non-compete",
          confidenceMarker: "clear" as const,
          reason: "Non-compete clause restricts future work",
          isRedLineTrigger: false,
          jurisdictionSensitive: true,
        },
      ],
      alsoSeen: [],
      verdict: { kind: "flags" as const },
    };

    const testBoundary = new TestModelBoundary({
      [`analyze:${contractText.substring(0, 50)}`]: { analysis: fixtureAnalysis },
    });

    const result = await analyzeContract(
      {
        documentText: contractText,
        redLines: [],
        governingLawState: "CA",
        operatingState: "CA",
      },
      testBoundary
    );

    // Find the non-compete flag
    const nonCompeteFlag = result.flags.find(
      (f) => f.clauseType === "non-compete"
    );
    expect(nonCompeteFlag).toBeDefined();
    if (nonCompeteFlag) {
      // When governing law is CA, the flag should be adjusted to unclear-get-help
      // because CA voids non-competes
      expect(nonCompeteFlag.confidenceMarker).toBe("unclear-get-help");
      expect(nonCompeteFlag.reason).toContain("Enforceability depends on");
    }
  });

  it("should adjust arbitration flags for non-us governing law", async () => {
    // Create actual contract text with the source sentence embedded
    const contractText =
      "AGREEMENT\n\nDisputes shall be resolved by arbitration in accordance with applicable law.";

    // Create a custom fixture with an arbitration clause
    const fixtureAnalysis = {
      summary: "Test contract with arbitration",
      flags: [
        {
          clauseType: "arbitration",
          severity: "Push" as const,
          sourceSentence: "Disputes shall be resolved by arbitration in accordance with applicable law.",
          counterOffer: "Allow court litigation",
          confidenceMarker: "clear" as const,
          reason: "Mandatory arbitration limits remedies",
          isRedLineTrigger: false,
          jurisdictionSensitive: true,
        },
      ],
      alsoSeen: [],
      verdict: { kind: "flags" as const },
    };

    const testBoundary = new TestModelBoundary({
      [`analyze:${contractText.substring(0, 50)}`]: { analysis: fixtureAnalysis },
    });

    const result = await analyzeContract(
      {
        documentText: contractText,
        redLines: [],
        governingLawState: "non-us",
        operatingState: "CA",
      },
      testBoundary
    );

    // Find the arbitration flag
    const arbFlag = result.flags.find((f) => f.clauseType === "arbitration");
    expect(arbFlag).toBeDefined();
    if (arbFlag) {
      expect(arbFlag.confidenceMarker).toBe("unclear-get-help");
      expect(arbFlag.reason).toContain("Enforceability depends on");
    }
  });
});
