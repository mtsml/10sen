import { ReactNode } from "react";

interface InformationProps {
  children: ReactNode;
}

const Information = ({ children }: InformationProps) => {
  return (
    <div className="information">
      {children}
    </div>
  );
}

export default Information;