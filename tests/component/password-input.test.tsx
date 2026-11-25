import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PasswordInput } from "@/components/shared/password-input";

describe("PasswordInput", () => {
  it("mặc định ẩn mật khẩu và chuyển đổi hiện/ẩn khi bấm nút con mắt", async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="pw">Mật khẩu</label>
        <PasswordInput id="pw" name="password" />
      </>,
    );

    const input = screen.getByLabelText("Mật khẩu");
    const toggle = screen.getByRole("button", { name: "Hiện mật khẩu" });

    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(toggle).toHaveAccessibleName("Ẩn mật khẩu");
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    await user.click(toggle);
    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAccessibleName("Hiện mật khẩu");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("bấm nút hiện mật khẩu không kích hoạt submit form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <label htmlFor="pw">Mật khẩu</label>
        <PasswordInput id="pw" name="password" />
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Hiện mật khẩu" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
