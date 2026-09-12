import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NewReview from "@/app/review/new/page";

describe("Document Intake (Paste)", () => {
  it("should capture pasted contract text in state", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();

    const contractText = "MASTER SERVICE AGREEMENT\n\nThis is a test contract.";
    fireEvent.change(textarea, { target: { value: contractText } });

    expect(textarea.value).toBe(contractText);
  });

  it("should reject empty input with an error message", () => {
    render(<NewReview />);

    const submitBtn = screen.getByRole("button", { name: /Analyze contract/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText("Please paste a contract document to continue.")
    ).toBeInTheDocument();
  });

  it("should reject whitespace-only input", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "   \n\n   " } });

    const submitBtn = screen.getByRole("button", { name: /Analyze contract/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText("Please paste a contract document to continue.")
    ).toBeInTheDocument();
  });

  it("should combine multiple pasted documents", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;

    const doc1 = "DOCUMENT 1\n\nThis is the first document.";
    fireEvent.change(textarea, { target: { value: doc1 } });
    expect(textarea.value).toBe(doc1);

    // Simulate pasting a second document
    const doc2 = "DOCUMENT 2\n\nThis is the second document.";
    fireEvent.change(textarea, {
      target: { value: `${doc1}\n\n---\n\n${doc2}` },
    });

    expect(textarea.value).toBe(`${doc1}\n\n---\n\n${doc2}`);
  });

  it("should display the notice about what Redline reads", () => {
    render(<NewReview />);

    const notice = screen.getByText(/only the text you paste/i);
    expect(notice).toBeInTheDocument();
  });

  it("should show character count when text is pasted", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    const contractText = "MASTER SERVICE AGREEMENT\n\nThis is a test.";

    fireEvent.change(textarea, { target: { value: contractText } });

    expect(screen.getByText(/Characters pasted:/i)).toBeInTheDocument();
    expect(
      screen.getByText(contractText.length.toString())
    ).toBeInTheDocument();
  });

  it("should accept valid text without immediate error", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    const contractText = "AGREEMENT\n\nSection 1. Valid terms.";

    fireEvent.change(textarea, { target: { value: contractText } });

    // Text should be captured without error before submission
    expect(textarea.value).toBe(contractText);
    expect(screen.queryByText("Please paste a contract document to continue.")).not.toBeInTheDocument();
  });

  it("should clear the form when Clear button is clicked", () => {
    render(<NewReview />);

    const textarea = screen.getByPlaceholderText(
      /Paste your contract text here/i
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Test contract" } });

    const clearBtn = screen.getByRole("button", { name: /Clear/i });
    fireEvent.click(clearBtn);

    expect(textarea.value).toBe("");
    expect(screen.queryByText(/Characters pasted:/i)).not.toBeInTheDocument();
  });
});
