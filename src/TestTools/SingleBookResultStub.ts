export function SingleBookResultStub(dynamicBookName?: string, dynamicBookId?: number) {
    return {
      success: true,
      result: [
        {
          bookId: dynamicBookId !== undefined ? dynamicBookId : 1,
          name: dynamicBookName !== undefined ? dynamicBookName : "I, Robot",
          emailOwnerId: "g@b.com",
          devOwnerId: "pete+dnd@logicroom.co",
        },
      ],
    };
  }
  