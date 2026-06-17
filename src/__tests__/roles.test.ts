import { describe, it, expect } from "vitest";
import { canAccess, ROLES } from "@/constants/roles";

describe("canAccess", () => {
  it("grants admin all modules", () => {
    expect(canAccess("admin", "settings")).toBe(true);
    expect(canAccess("admin", "faculty")).toBe(true);
  });

  it("restricts staff from admin-only modules", () => {
    expect(canAccess("staff", "students")).toBe(true);
    expect(canAccess("staff", "settings")).toBe(false);
    expect(canAccess("staff", "faculty")).toBe(false);
  });

  it("restricts faculty to assigned modules", () => {
    expect(canAccess("faculty", "attendance")).toBe(true);
    expect(canAccess("faculty", "students")).toBe(false);
  });

  it("defines three roles", () => {
    expect(Object.keys(ROLES)).toEqual(["admin", "staff", "faculty"]);
  });
});
