import { test, expect } from "@playwright/test";
test("fresh sample opens results, persists reload and does not leak input to analytics", async ({
  page,
}) => {
  const bodies: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/events")) bodies.push(r.postData() || "");
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Mở kịch bản minh họa →" })
    .first()
    .click();
  await expect(page).toHaveURL(/ket-qua/);
  await expect(page.getByRole("heading", { name: /Khoản vay/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: /Khoản vay/ })).toBeVisible();
  expect(page.url()).not.toContain("?");
  for (const body of bodies) {
    const event = JSON.parse(body);
    expect(Object.keys(event).sort()).toEqual(["event", "source"]);
    expect(body).not.toMatch(/2000000000|55000000|salary|income|DEFICIT/);
  }
  await page.screenshot({
    path: `test-results/results-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("contact failure preserves fields; repeated request keeps submission id", async ({
  page,
}) => {
  const payloads: any[] = [];
  await page.route("**/api/contact", async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({
      status: payloads.length === 1 ? 503 : 201,
      contentType: "application/json",
      body: JSON.stringify(
        payloads.length === 1
          ? { success: false, message: "Chưa thể tiếp nhận" }
          : { success: true, requestCode: "DG-123456789ABC" },
      ),
    });
  });
  await page.goto("/lien-he");
  await page
    .getByRole("textbox", { name: "Email nhận phản hồi" })
    .fill("buyer@example.com");
  await page
    .getByRole("textbox", { name: "Chi tiết" })
    .fill("Please check my example calculation");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Gửi phản hồi" }).click();
  await expect(page.locator('form [role="alert"]')).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Chi tiết" })).toHaveValue(
    "Please check my example calculation",
  );
  await page.getByRole("button", { name: "Gửi phản hồi" }).click();
  await expect(page.getByRole("status")).toContainText("DG-123456789ABC");
  expect(payloads[0].submissionId).toBe(payloads[1].submissionId);
});
test("service is honest when disabled; legacy support and metadata remain available", async ({
  page,
  request,
}) => {
  await page.goto("/ra-soat-ho-so-vay");
  await expect(page.getByRole("status")).toContainText("chưa nhận hồ sơ");
  await expect(
    page.getByRole("link", { name: "Gửi yêu cầu rà soát" }),
  ).toHaveCount(0);
  for (const path of [
    "/support",
    "/privacy",
    "/support/cho-con",
    "/privacy/cho-con",
    "/cap-nhat",
    "/bao-cao-mau",
  ])
    expect((await request.get(path)).status()).toBe(200);
  await page.goto("/dang-ky-ra-soat");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
test("mobile layout fits viewport and report prints its content", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/home-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.screenshot({
    path: `test-results/preview-home-${test.info().project.name}.png`,
    fullPage: false,
  });
  await page.goto("/bao-cao-mau");
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByRole("heading", { name: "Báo cáo mô phỏng trước đặt cọc" }),
  ).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(4);
});
