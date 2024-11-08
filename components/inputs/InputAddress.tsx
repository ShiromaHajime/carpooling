import { useEffect, useState } from "react";
import { Input } from "./Input"
import { useColorScheme } from "nativewind";

interface PropsInputAddress {
    setValueInput: Function,
    handleOnFocus?: () => void,
    handleOnBlur?: () => void,
    valueInput?: string,
    placeholder: string,
    className?: string
}
export const InputAddress = ({ setValueInput, valueInput, placeholder, className, handleOnFocus, handleOnBlur }: PropsInputAddress) => {

    const [value, setValue] = useState(valueInput);

    useEffect(() => {
        setValue(valueInput)
    }, [valueInput])

    const { colorScheme } = useColorScheme();

    const handleSetValue = (value: string) => {
        setValueInput(value)
        setValue(value)
    }

    return (
        <Input
            numberOfLines={1}
            className={`focus:border focus:border-slate-900 
            ${(colorScheme == 'dark' ? 'dark:focus:border-gray-400' : '')}
            ${className}`}
            value={value}
            onChangeText={(e) => handleSetValue(e)}
            placeholder={placeholder}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
        />
    )
}