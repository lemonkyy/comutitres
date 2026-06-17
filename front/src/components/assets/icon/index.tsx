"use client";

import { type IconName, icons } from "./config";

type Props = {
  name: IconName;
  title?: string;
  className?: string;
};

const Icon = ({ name, title = "", className = "", ...props }: Props) => {
  const IconComponent = icons[name];

  return (
    <span title={title} className={`w-fit h-fit ${className}`}>
      {IconComponent && <IconComponent {...props} />}
    </span>
  );
};

export default Icon;
