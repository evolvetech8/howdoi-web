/** @vitest-environment jsdom */
import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import Home from "@/app/page";
import Sample from "@/app/bao-cao-mau/page";
import Contact from "@/components/depositguard/common/ContactForm";
import Method from "@/app/cach-tinh/page";
import FAQ from "@/app/cau-hoi-thuong-gap/page";
import Guides from "@/app/huong-dan/page";
import { SimulationProvider } from "@/lib/depositguard/context";
import { EXAMPLES, evaluateExample } from "@/lib/depositguard/examples";
import { formatVND } from "@/lib/depositguard/formatters";
import sitemap from "@/app/sitemap";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));
let container: HTMLDivElement, root: Root;
beforeEach(() => {
  sessionStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  vi.stubGlobal("fetch", vi.fn());
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});
it("makes examples and free entry available without preselecting user risks", () => {
  act(() =>
    root.render(
      <SimulationProvider>
        <Home />
      </SimulationProvider>,
    ),
  );
  expect(container.querySelector('a[href="/kiem-tra-mua-nha"]')).not.toBeNull();
  expect(
    container.querySelectorAll('input[type="checkbox"]:checked'),
  ).toHaveLength(0);
  expect(container.textContent).toContain("không phải hồ sơ khách hàng thật");
  expect(container.textContent).not.toContain("311+");
  const sample = Array.from(container.querySelectorAll("button")).find((b) =>
    b.textContent?.includes("Mở kịch bản minh họa"),
  )!;
  act(() => sample.click());
  expect(push).toHaveBeenCalledWith("/ket-qua");
  expect(
    JSON.parse(sessionStorage.getItem("depositguard_simulation_v1")!)
      .hasSimulated,
  ).toBe(true);
});
it("renders report numbers from the model with distinct baseline and shock assumptions", () => {
  act(() => root.render(<Sample />));
  const { solver } = evaluateExample(EXAMPLES[0]);
  expect(container.textContent).toContain(formatVND(solver.maxSafeLoanAmount));
  expect(container.textContent).toContain("14%");
  expect(container.querySelectorAll("tbody tr")).toHaveLength(4);
  expect(container.textContent).toContain("chưa đủ");
});
it("contact failure preserves input; retry uses the same submission id and awaits a real response", async () => {
  const fetcher = vi.mocked(fetch);
  fetcher.mockResolvedValueOnce(
    Response.json(
      { success: false, message: "Chưa thể tiếp nhận" },
      { status: 503 },
    ),
  );
  act(() => root.render(<Contact />));
  (container.querySelector('[name="email"]') as HTMLInputElement).value =
    "buyer@example.com";
  (container.querySelector('[name="message"]') as HTMLTextAreaElement).value =
    "Test calculation question";
  await act(async () => {
    container
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(container.querySelector('[role="alert"]')?.textContent).toContain(
    "Chưa thể",
  );
  expect(
    (container.querySelector('[name="message"]') as HTMLTextAreaElement).value,
  ).toBe("Test calculation question");
  fetcher.mockResolvedValueOnce(
    Response.json(
      { success: true, requestCode: "DG-123456789ABC" },
      { status: 201 },
    ),
  );
  await act(async () => {
    container
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  const a = JSON.parse(fetcher.mock.calls[0][1]!.body as string),
    b = JSON.parse(fetcher.mock.calls[1][1]!.body as string);
  expect(a.submissionId).toBe(b.submissionId);
  expect(container.querySelector('[role="status"]')?.textContent).toContain(
    "DG-123456789ABC",
  );
});
it("keeps methodology, FAQ and guide routes renderable", () => {
  for (const Component of [Method, FAQ, Guides]) {
    act(() => root.render(<Component />));
    expect(container.querySelector("h1")).not.toBeNull();
  }
});
it("indexes public offers and updates but never intake/results", () => {
  const urls = sitemap().map((x) => x.url);
  expect(urls).toContain("https://www.evolvetech.biz.vn/ra-soat-ho-so-vay");
  expect(urls).toContain("https://www.evolvetech.biz.vn/cap-nhat");
  expect(
    urls.some((x) => x.includes("/ket-qua") || x.includes("/dang-ky")),
  ).toBe(false);
});
