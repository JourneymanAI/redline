import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewReview from "@/app/review/new/page";

describe("Walking Skeleton: Paste → Analyze → Result", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("should analyze a pasted contract and display the result screen with flags", async () => {
    // Using TechVendor/SampleCorp fixture that matches fixture-responses.ts
    const fixtureText = `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of September 12, 2026, between TechVendor Inc., a Delaware corporation ("Vendor"), and SampleCorp LLC, a California limited liability company ("Client").

1. SERVICES

Vendor shall provide software development and consulting services as specified in individual Statements of Work (SOWs) issued under this Agreement.

2. TERM AND TERMINATION

This Agreement shall commence on the date hereof and continue for one (1) year, unless earlier terminated. Vendor may terminate this Agreement at any time upon thirty (30) days' written notice to Client, with or without cause. Upon termination, Client shall immediately pay all fees owed through the termination date, including all work in progress, and shall have no right to recover amounts paid.

3. INTELLECTUAL PROPERTY

All work product, code, documentation, and any intellectual property created by Vendor in connection with the Services, whether before, during, or after this Agreement, shall be the sole and exclusive property of Vendor. Client hereby assigns all right, title, and interest in such intellectual property to Vendor, including all patent, copyright, trademark, and trade secret rights. Client retains no license to use such work product except as expressly granted herein.

4. INDEMNIFICATION

Client shall indemnify, defend, and hold harmless Vendor and its officers, directors, employees, and agents from and against any and all third-party claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or relating to Client's use of the Services, Client's data, Client's breach of this Agreement, or Client's violation of any law. This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim or any opportunity to mitigate damages.

5. PAYMENT TERMS

Client shall pay Vendor's invoices within thirty (30) days of receipt. Late payments shall accrue interest at the rate of 2% per month or the maximum rate permitted by law, whichever is greater.

6. GOVERNING LAW

This Agreement shall be governed by the laws of the State of Delaware, without regard to its conflict of law principles.

7. LIMITATION OF LIABILITY

Vendor's total liability under this Agreement shall not exceed the lesser of actual damages or one dollar ($1.00). IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, CONSEQUENTIAL, SPECIAL, INCIDENTAL, PUNITIVE, OR EXEMPLARY DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

8. PERSONAL GUARANTEE

The signatory on behalf of Client, if an individual or if Client is a partnership or LLC, personally guarantees all of Client's obligations under this Agreement, including payment obligations, indemnification obligations, and compliance with all terms hereof. The signatory agrees that Vendor may pursue claims against the signatory personally and may do so without first exhausting remedies against Client.

9. CONFIDENTIALITY

Any information disclosed by one party to the other shall be treated as confidential. Vendor may use Client's name, logo, and description of Client's use of the Services for any purpose without prior written consent, and may disclose all information related to Client to any third party, including competitors, for any reason.

10. ASSIGNMENT

Vendor may assign this Agreement or any part hereof to any third party without Client's consent. Client may not assign this Agreement.

11. ENTIRE AGREEMENT

This Agreement, including any applicable SOW, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, and agreements.`;

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
        expect(screen.queryByRole("button", { name: /Analyze another contract/i })).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify result screen is displayed with flags (not clean)
    expect(screen.queryByText(/You're probably fine/i)).not.toBeInTheDocument();

    // Verify flags are displayed (multiple BLOCKER flags)
    const blockers = screen.getAllByText(/BLOCKER/i);
    expect(blockers.length).toBeGreaterThan(0);

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

This Agreement shall commence on the date signed by both parties and shall continue for one (1) year from the date of inception, unless terminated earlier by either party for material breach if not cured within thirty (30) days of written notice. Either party may terminate for convenience by providing sixty (60) days' written notice. Upon termination, Service Provider shall deliver all completed work and materials, and Company shall pay all fees for work completed through the termination date.

3. INTELLECTUAL PROPERTY

Service Provider retains all pre-existing intellectual property and tools developed prior to engagement. Company shall own all custom work product, code, and documentation created specifically for Company under this Agreement. Service Provider retains the right to use general methodologies, knowledge, and know-how developed in performing the Services.

4. LIABILITY AND INDEMNIFICATION

Except in cases of gross negligence or willful misconduct, Service Provider's total liability shall not exceed the fees paid in the twelve (12) months preceding the claim. Each party shall indemnify the other against third-party claims arising from its own breach of this Agreement or violation of law. Neither party shall be liable for indirect, consequential, or punitive damages.

5. PAYMENT

Company shall pay invoices within thirty (30) days of receipt. Invoices are due and payable in full regardless of whether the services are disputed. Disputed portions must be raised in writing within fifteen (15) days of invoice. Late payment shall accrue interest at 1.5% per month or the maximum rate allowed by law.

6. CONFIDENTIALITY

Each party agrees to keep confidential any proprietary information disclosed by the other party, except as required by law or court order, or with the other party's prior written consent. The confidentiality obligation shall expire three (3) years after termination of this Agreement.

7. GOVERNING LAW

This Agreement shall be governed by the laws of Colorado, without regard to its choice-of-law provisions.

8. LIMITATION OF LIABILITY

Company's sole remedy for any breach shall be termination of the Agreement. Service Provider's total cumulative liability for all claims, regardless of cause, shall be limited to the fees paid by Company in the twelve (12) months immediately preceding the claim, provided that liability for gross negligence or breach of confidentiality shall not exceed such cap.

9. INDEPENDENT CONTRACTOR

Service Provider is an independent contractor. Nothing in this Agreement creates an employment relationship, partnership, or agency relationship between the parties.

10. ENTIRE AGREEMENT

This Agreement, including any Statements of Work, constitutes the entire agreement regarding the Services. Any modifications must be in writing and signed by both parties.

11. SEVERABILITY

If any provision is found invalid or unenforceable, the remaining provisions shall remain in effect.`;

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
      { timeout: 5000 }
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

Vendor shall provide software development and consulting services as specified in individual Statements of Work (SOWs) issued under this Agreement.

2. TERM AND TERMINATION

This Agreement shall commence on the date hereof and continue for one (1) year, unless earlier terminated. Vendor may terminate this Agreement at any time upon thirty (30) days' written notice to Client, with or without cause. Upon termination, Client shall immediately pay all fees owed through the termination date, including all work in progress, and shall have no right to recover amounts paid.

3. INTELLECTUAL PROPERTY

All work product, code, documentation, and any intellectual property created by Vendor in connection with the Services, whether before, during, or after this Agreement, shall be the sole and exclusive property of Vendor. Client hereby assigns all right, title, and interest in such intellectual property to Vendor, including all patent, copyright, trademark, and trade secret rights. Client retains no license to use such work product except as expressly granted herein.

4. INDEMNIFICATION

Client shall indemnify, defend, and hold harmless Vendor and its officers, directors, employees, and agents from and against any and all third-party claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or relating to Client's use of the Services, Client's data, Client's breach of this Agreement, or Client's violation of any law. This indemnification obligation is unlimited in scope, amount, and time, and applies to any claim regardless of whether Vendor had any knowledge of the potential claim or any opportunity to mitigate damages.

5. PAYMENT TERMS

Client shall pay Vendor's invoices within thirty (30) days of receipt. Late payments shall accrue interest at the rate of 2% per month or the maximum rate permitted by law, whichever is greater.

6. GOVERNING LAW

This Agreement shall be governed by the laws of the State of Delaware, without regard to its conflict of law principles.

7. LIMITATION OF LIABILITY

Vendor's total liability under this Agreement shall not exceed the lesser of actual damages or one dollar ($1.00). IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, CONSEQUENTIAL, SPECIAL, INCIDENTAL, PUNITIVE, OR EXEMPLARY DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

8. PERSONAL GUARANTEE

The signatory on behalf of Client, if an individual or if Client is a partnership or LLC, personally guarantees all of Client's obligations under this Agreement, including payment obligations, indemnification obligations, and compliance with all terms hereof. The signatory agrees that Vendor may pursue claims against the signatory personally and may do so without first exhausting remedies against Client.`;

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
      { timeout: 5000 }
    );

    // Click "Analyze another contract"
    const anotherBtn = screen.getByRole("button", {
      name: /Analyze another contract/i,
    });
    fireEvent.click(anotherBtn);

    // Verify we're back at the input form
    const textareaAfter = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    expect(textareaAfter).toBeInTheDocument();
    expect(textareaAfter.value).toBe("");
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

    // Wait for error message to appear
    await waitFor(
      () => {
        expect(screen.queryByText(/No fixture found/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify error is displayed
    expect(screen.getByText(/No fixture found/i)).toBeInTheDocument();

    // Verify we're still on the input form
    expect(
      screen.getByPlaceholderText(/Paste your contract text here/i)
    ).toBeInTheDocument();
  });
});
