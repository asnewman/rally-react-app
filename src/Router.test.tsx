import { comparePath } from "./Router";
import { Failure, Success } from "./Utility";

describe("comparePath tests", () => {
  it("works on valid match and slugs", () => {
    const res = comparePath("/rally/:id", "/rally/123");

    if (res instanceof Failure) {
      // eslint-disable-next-line no-throw-literal
      throw "Failure on valid path";
    }

    expect(res).toBeInstanceOf(Success);
    expect(res.data).toEqual({ doesMatch: true, slugs: { id: "123" } });
  });

  it("works on valid match and slugs v2", () => {
    const res = comparePath(
      "/rally/:id/:author/message/:messageid/day",
      "/rally/123/ash/message/999/day"
    );

    if (res instanceof Failure) {
      // eslint-disable-next-line no-throw-literal
      throw "Failure on valid path";
    }

    expect(res).toBeInstanceOf(Success);
    expect(res.data).toEqual({
      doesMatch: true,
      slugs: { id: "123", author: "ash", messageid: "999" },
    });
  });

  it("success with no match on a non-match", () => {
    const res = comparePath("/swapi/hello", "/rally/123/ash/message/999/day");

    if (res instanceof Failure) {
      // eslint-disable-next-line no-throw-literal
      throw "Failure on valid path";
    }

    expect(res).toBeInstanceOf(Success);
    expect(res.data).toEqual({ doesMatch: false, slugs: {} });
  });
});
