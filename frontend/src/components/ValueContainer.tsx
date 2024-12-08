import { createSignal, ParentComponent } from "solid-js";

interface Props {
  label: string
  onChange: (value: string) => void
}

export const ValueContainer: ParentComponent<Props> = (props) => {
  const [showInput, setShowInput] = createSignal(false)
  const handleInputClose = (val: string) => {
    props.onChange(val)
    setShowInput(false)
  }
  return (
    <p>
      <strong>{props.label}:</strong>
      <span id="name" ondblclick={() => setShowInput(true)} classList={{ "hidden": !showInput() }}>
        {props.children}
      </span>
      <input
        value={props.children?.toString()}
        onblur={(e) => handleInputClose(e.currentTarget.value)}
        onkeydown={(e) => e.key === "Enter" ? handleInputClose(e.currentTarget.value) : null}
        classList={{ "hidden": showInput() }} />
    </p>
  );
};
