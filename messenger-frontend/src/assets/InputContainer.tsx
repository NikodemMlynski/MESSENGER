import { FC } from "react";

const InputContainer: FC<{
    name: string;
    labelText: string;
    type: string;
    }> = ({name, type, labelText}) => (
    <p>
            <label htmlFor={name}>{labelText}</label>
            <input type={type} name={name} id={name}/>
    </p>
)

export default InputContainer;