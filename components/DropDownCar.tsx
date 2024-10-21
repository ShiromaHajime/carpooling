import { DropDown, DropDownContent, DropDownItem, DropDownItemSeparator, DropDownLabel, DropDownTrigger } from "@/components/DropDown"
import { Button } from "@/components/buttons/Button"
import { IconCar, IconChevronDown } from "@/components/icons/Icons"
import { CircleUser, Settings } from "lucide-react-native"
import { useState } from "react"
import { Pressable, Text, TouchableOpacity, View } from "react-native"

interface DropDownProps {
    selected?: string,
    options: string[],
    handleSelected: (value: string) => void
}

export const DropDownCar = ({ options, selected, handleSelected }: DropDownProps) => {

    const [select, setSelect] = useState(selected ? selected : options[0])

    const handleSelectOption = (option: string) => {
        setSelect(option)
        handleSelected(option)
    }

    const ItemDropDown = ({ option }: { option: string }) => {
        return (
            <DropDownItem className={`${(option == select ? 'bg-[#e6e6e6] dark:bg-[#292929]' : '')}`}>
                <TouchableOpacity className={`flex flex-row gap-2 items-center `}
                    onPress={() => handleSelectOption(option)}>
                    <IconCar />
                    <Text className="text-foreground">{option}</Text>
                </TouchableOpacity>
            </DropDownItem>
        )
    }

    return (
        <DropDown>
            <DropDownTrigger>
                <Pressable>
                    <DropDownItem className="flex flex-row gap-2 justify-between items-center bg-background">
                        <Text className="text-foreground ml-2">{select}</Text>
                        <IconChevronDown />
                    </DropDownItem>
                </Pressable>
            </DropDownTrigger>
            <DropDownContent className="mt-1">
                <DropDownLabel labelTitle="Mis vehículos" />
                <DropDownItemSeparator />
                {(options.map((option) => (
                    <ItemDropDown key={option} option={option} />
                )))}
            </DropDownContent>
        </DropDown>
    )
}