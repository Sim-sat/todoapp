import React, {ReactNode, useEffect, useState} from "react";

// Definiere den Typ der Props
interface ProgressProviderProps {
    valueStart: number;
    valueEnd: number;
    children: (value: number) => ReactNode; // children ist eine Funktion, die einen Wert zurückgibt
}

const ProgressProvider: React.FC<ProgressProviderProps> = ({valueStart, valueEnd, children}) => {
    const [value, setValue] = useState<number>(valueStart);

    useEffect(() => {
        setValue(valueEnd);
    }, [valueEnd]);

    return <>{children(value)}</>;
};

export default ProgressProvider;
