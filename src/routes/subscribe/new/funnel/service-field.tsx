import { CATEGORY_SERVICES } from "../../../../constants/category";
import { BottomSheet, ListRow, TextField } from "@toss/tds-mobile";
import { useCallback, useRef, useState } from "react";
import { useSubscribeContext } from "../subscribe-context";

function ServiceField() {
  const { category, service, onChangeService } =
    useSubscribeContext("ServiceField");
  const [open, setOpen] = useState<boolean>(false);
  const [custom, setCustom] = useState<boolean>(false);
  const [prevCategory, setPrevCategory] = useState(category);
  const inputRef = useRef<HTMLInputElement>(null);

  if (category !== prevCategory) {
    setPrevCategory(category);
    setCustom(category === "ETC");
    setOpen(category !== null && category !== "ETC");
    onChangeService("");
  }

  const setInputRef = useCallback((node: HTMLInputElement) => {
    inputRef.current = node;
    inputRef.current?.focus();
  }, []);

  if (!category) {
    return <></>;
  }

  const editable = custom || category === "ETC";

  return (
    <div>
      <TextField
        ref={setInputRef}
        variant="line"
        label="서비스"
        labelOption="appear"
        placeholder="서비스명"
        value={service ? service : ""}
        readOnly={!editable}
        onClick={() => {
          if (editable) return;
          setOpen(!open);
        }}
        onChange={(e) => {
          const serviceName = e.target.value;
          onChangeService(serviceName);
        }}
      />
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        portalContainer={document.getElementById("app-root")}
      >
        {CATEGORY_SERVICES[category].map((serviceName) => (
          <ListRow
            key={serviceName}
            contents={<ListRow.Texts type="1RowTypeA" top={serviceName} />}
            onClick={() => {
              setCustom(false);
              onChangeService(serviceName);
              setOpen(false);
            }}
          />
        ))}
        <ListRow
          left={<ListRow.AssetIcon name="icon-plus-circle" />}
          contents={<ListRow.Texts type="1RowTypeA" top={"직접입력"} />}
          onClick={() => {
            setCustom(true);
            onChangeService("");
            setOpen(false);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        />
      </BottomSheet>
    </div>
  );
}

export default ServiceField;
