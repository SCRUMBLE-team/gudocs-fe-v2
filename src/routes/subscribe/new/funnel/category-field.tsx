import { CATEGORY_META } from "../../../../constants/category";
import type { SubscribeCategory } from "../../../../types/subscribe";
import { BottomSheet, ListRow, TextField } from "@toss/tds-mobile";
import { useState } from "react";
import { useSubscribeContext } from "../subscribe-context";

const CATEGORY_ENTRIES = Object.entries(CATEGORY_META) as [
  SubscribeCategory,
  (typeof CATEGORY_META)[SubscribeCategory],
][];

function CategoryField() {
  const { category, onChangeCategory } = useSubscribeContext("CategoryField");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <TextField
        variant="line"
        label="카테고리"
        labelOption="appear"
        placeholder="카테고리"
        value={category ? CATEGORY_META[category].label : ""}
        readOnly
        onClick={() => setOpen(!open)}
      />
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        portalContainer={document.getElementById("app-root")}
      >
        {CATEGORY_ENTRIES.map(([code, meta]) => (
          <ListRow
            key={code}
            left={<ListRow.AssetIcon name={meta.icon} />}
            contents={<ListRow.Texts type="1RowTypeA" top={meta.label} />}
            onClick={() => {
              onChangeCategory(code);
              setOpen(false);
            }}
          />
        ))}
      </BottomSheet>
    </>
  );
}

export default CategoryField;
