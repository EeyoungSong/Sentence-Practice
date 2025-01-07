import { useState } from 'react';

export default function CheckboxWithLabel({
  labelOn,
  labelOff,
}: {
  labelOn: string;
  labelOff: string;
}): JSX.Element {
  const [isChecked, setIsChecked] = useState(false);

  const onChange = (): void => {
    setIsChecked(!isChecked);
  };

  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {isChecked ? labelOn : labelOff}
    </label>
  );
}
