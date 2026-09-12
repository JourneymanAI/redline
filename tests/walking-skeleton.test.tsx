import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewReview from "@/app/review/new/page";

describe("Walking Skeleton: Paste → Analyze → Result", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("should analyze a pasted contract and display the result screen with flags", async () => {
    // Read the actual fixture for testing
    const fixtureText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").

1. SERVICES

Vendor shall provide software development and consulting services as specified in individual Statements of Work (SOWs) issued under this Agreement.

2. TERM AND TERMINATION

This Agreement shall commence on the date hereof and continue for one (1) year, unless earlier terminated. Vendor may terminate this Agreement at any time upon thirty (30) days' written notice to Client, with or without cause. Upon termination, Client shall immediately pay all fees owed through the termination date, including all work in progress, and shall have no right to recover amounts paid.

3. INTELLECTUAL PROPERTY

All work product, code, documentation, and any intellectual property created by Vendor in connection with the Services, whether before, during, or after this Agreement, shall be the sole and exclusive property of Vendor. Client hereby assigns all right, title, and interest in such intellectual property to Vendor, including all patent, copyright, trademark, and trade secret rights. Client retains no license to use such work product except as expressly granted herein.

4. INDEMNIFICATION

Client shall indemnify, defend, and hold harmless Vendor and its officers, directors, employees, and agents from and against any and all third-party claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or relating to Client's use of the Services, Client's data, Client's breach of this Agreement, or Client's violation of any law. This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim or any opportunity to mitigate damages.`;

    render(<NewReview />);

    // Find and fill the textarea
    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: fixtureText } });

    // Verify text was entered
    expect(textarea.value).toBe(fixtureText);

    // Click Analyze button
    const analyzeBtn = screen.getByRole("button", { name: /Analyze contract/i });
    fireEvent.click(analyzeBtn);

    // Wait for the result screen to appear
    await waitFor(
      () => {
        expect(screen.queryByText(/personal-guarantee/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify result screen is displayed with flags
    expect(screen.getByText(/You're probably fine/i)).not.toBeInTheDocument(); // Should have issues

    // Verify flags are displayed
    const blocker = screen.getByText(/BLOCKER/i);
    expect(blocker).toBeInTheDocument();

    // Verify source sentences are verbatim substrings
    const personalGuaranteeText =
      'The signatory on behalf of Client, if an individual or if Client is a partnership or LLC, personally guarantees all of Client\'s obligations under this Agreement, including payment obligations, indemnification obligations, and compliance with all terms hereof.';
    expect(fixtureText).toContain(personalGuaranteeText);

    // Verify "Analyze another contract" button appears
    const anotherBtn = screen.getByRole("button", {
      name: /Analyze another contract/i,
    });
    expect(anotherBtn).toBeInTheDocument();
  });

  it("should display clean verdict when analyzing a balanced contract", async () => {
    const cleanContractText = `SOFTWARE SERVICES AGREEMENT

This Software Services Agreement ("Agreement") is entered into as of September 12, 2026, between Reliable Software Partners, Inc., a Colorado corporation ("Service Provider"), and Midwest Manufacturing Corp., a Michigan limited liability company ("Company").

1. SERVICES

Service Provider shall provide professional software development and consulting services as described in individual Statements of Work (SOWs) appended to this Agreement and mutually executed by both parties.

2. TERM AND TERMINATION

This Agreement shall commence on the date signed by both parties and shall continue for one (1) year from the date of inception, unless terminated earlier by either party for material breach if not cured within thirty (30) days of written notice. Either party may terminate for convenience by providing sixty (60) days' written notice. Upon termination, Service Provider shall deliver all completed work and materials, and Company shall pay all fees for work completed through the termination date.`;

    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: cleanContractText } });

    const analyzeBtn = screen.getByRole("button", { name: /Analyze contract/i });
    fireEvent.click(analyzeBtn);

    // Wait for result screen
    await waitFor(
      () => {
        expect(screen.getByText(/You're probably fine/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify clean verdict
    expect(
      screen.getByText(/You're probably fine/i)
    ).toBeInTheDocument();

    // Verify "Analyze another contract" button
    const anotherBtn = screen.getByRole("button", {
      name: /Analyze another contract/i,
    });
    expect(anotherBtn).toBeInTheDocument();
  });

  it("should go back to input when clicking Analyze another contract", async () => {
    const contractText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").

1. SERVICES

Vendor shall provide software development and consulting services as specified in individual Statements of Work (SOWs) issued under this Agreement.`;

    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: contractText } });

    const analyzeBtn = screen.getByRole("button", { name: /Analyze contract/i });
    fireEvent.click(analyzeBtn);

    // Wait for result screen
    await waitFor(
      () => {
        expect(screen.queryByRole("button", { name: /Analyze another contract/i })).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Click "Analyze another contract"
    const anotherBtn = screen.getByRole("button", {
      name: /Analyze another contract/i,
    });
    fireEvent.click(anotherBtn);

    // Verify we're back at the input form
    expect(
      screen.getByPlaceholderText(/Paste your contract text here/i)
    ).toBeInTheDocument();
    expect(textarea.value).toBe("");
  });

  it("should display an error for unrecognized fixture contracts", async () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: { value: "Some unknown contract text" },
    });

    const analyzeBtn = screen.getByRole("button", { name: /Analyze contract/i });
    fireEvent.click(analyzeBtn);

    // Wait for error message
    await waitFor(
      () => {
        expect(
          screen.getByText(/No fixture found for this document/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify error is displayed
    expect(
      screen.getByText(/No fixture found for this document/i)
    ).toBeInTheDocument();

    // Verify we're still on the input form
    expect(
      screen.getByPlaceholderText(/Paste your contract text here/i)
    ).toBeInTheDocument();
  });
});
