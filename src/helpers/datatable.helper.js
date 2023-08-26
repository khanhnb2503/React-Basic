export function convertTreeData(items, treeColumn, treeTo = "children") {
  if (!items && !items?.length) {
    return [];
  }
  return items.map((i, indexI) => ({
    ...i,
    key: indexI + 1,
    [treeTo]: i[treeColumn]?.map((ii, indexII) => ({
      ...ii,
      key: (indexI + 1) * 10 + indexII + 1,
      [treeTo]: ii[treeColumn]?.map((iii, indexIII) => ({
        ...iii,
        key: (indexI + 1) * 100 + (indexII + 1) * 10 + indexIII + 1,
        [treeTo]: iii[treeColumn]?.map((iiii, indexIIII) => ({
          ...iiii,
          key:
            (indexI + 1) * 1000 +
            (indexII + 1) * 100 +
            (indexIII + 1) * 10 +
            indexIIII +
            1,
          [treeTo]: iiii[treeColumn],
        })),
      })),
    })),
  }));
}

export function convertTreeDataIfExist(items, treeColumn, treeTo = "children") {
  if (!items && !items?.length) {
    return [];
  }
  return items.map((i, indexI) => {
    let level1 = {
      ...i,
      key: `${indexI + 1}`,
    };
    if (level1[treeColumn]?.length) {
      level1 = {
        ...level1,
        [treeTo]: i[treeColumn]?.map((ii, indexII) => {
          let level2 = {
            ...ii,
            key: `${indexI + 1}.${indexII + 1}`,
          };
          if (level2[treeColumn]?.length) {
            level2 = {
              ...level2,
              [treeTo]: ii[treeColumn]?.map((iii, indexIII) => {
                let level3 = {
                  ...iii,
                  key: `${indexI + 1}.${indexII + 1}.${indexIII + 1}`,
                };
                if (level3[treeColumn]?.length) {
                  level3 = {
                    ...level3,
                    [treeTo]: iii[treeColumn]?.map((iiii, indexIIII) => {
                      let level4 = {
                        ...iiii,
                        key: `${indexI + 1}.${indexII + 1}.${indexIII + 1}.${
                          indexIIII + 1
                        }`,
                      };
                      if (level4[treeColumn]?.length) {
                        level4 = {
                          ...level4,
                          [treeTo]: iiii[treeColumn],
                        };
                      }
                      return level4;
                    }),
                  };
                }
                return level3;
              }),
            };
          }
          return level2;
        }),
      };
    }
    return level1;
  });
}
