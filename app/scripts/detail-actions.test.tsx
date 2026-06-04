import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScriptDetailActions } from "./detail-actions";

describe("script detail actions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies the script body and triggers a ps1 download", async () => {
    const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
      url: "http://localhost/scripts/operatoros/endpoint/example",
    });
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    const originalNavigator = globalThis.navigator;
    const originalUrl = globalThis.URL;
    const writeText = vi.fn().mockResolvedValue(undefined);
    const createObjectURL = vi.fn(() => "blob:script");
    const revokeObjectURL = vi.fn();
    const click = vi.fn();

    Object.defineProperty(globalThis, "window", { configurable: true, value: dom.window });
    Object.defineProperty(globalThis, "document", { configurable: true, value: dom.window.document });
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        clipboard: {
          writeText,
        },
      },
    });
    Object.defineProperty(globalThis, "URL", {
      configurable: true,
      value: {
        createObjectURL,
        revokeObjectURL,
      },
    });
    vi.spyOn(dom.window.document, "createElement").mockImplementation((tagName: string) => {
      const element = dom.window.document.createElementNS("http://www.w3.org/1999/xhtml", tagName);

      if (tagName === "a") {
        Object.defineProperty(element, "click", { configurable: true, value: click });
      }

      return element as HTMLElement;
    });

    try {
      const rootElement = dom.window.document.getElementById("root");

      if (!rootElement) {
        throw new Error("Missing test root.");
      }

      const root = createRoot(rootElement);
      await act(async () => {
        root.render(<ScriptDetailActions scriptBody="Get-ComputerInfo" slug="collect-inventory" />);
      });

      const buttons = Array.from(dom.window.document.querySelectorAll("button")) as HTMLButtonElement[];

      buttons.find((button) => button.textContent === "Copy Script")?.click();
      buttons.find((button) => button.textContent === "Download .ps1")?.click();

      expect(writeText).toHaveBeenCalledWith("Get-ComputerInfo");
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:script");
    } finally {
      Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
      Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
      Object.defineProperty(globalThis, "navigator", { configurable: true, value: originalNavigator });
      Object.defineProperty(globalThis, "URL", { configurable: true, value: originalUrl });
    }
  });
});
