import { DropDown, DropDownContent, DropDownItem, DropDownItemSeparator, DropDownLabel, DropDownTrigger } from "@/components/DropDown"
import { IconCar, IconChevronDown } from "@/components/icons/Icons"
import { VehicleDB } from "@/types/types"
import { useState } from "react"
import { Pressable, Text, TouchableOpacity, View } from "react-native"

interface DropDownProps {
    selected?: string,
    options: VehicleDB[],
    handleSelected: (value: number) => void
}

export const DropDownCar = ({ options, selected, handleSelected }: DropDownProps) => {
    const firstCar = options[0]
    const initialSelected = `${firstCar.brand} ${firstCar.model} ${firstCar.color}`
    const [select, setSelect] = useState(selected ? selected : initialSelected)

    const handleSelectOption = (option: VehicleDB) => {
        const text = `${option.brand} ${option.model} ${option.color}`
        setSelect(text)
        handleSelected(option.id)
    }

    const ItemDropDown = ({ option }: { option: VehicleDB }) => {
        const text = `${option.brand} ${option.model} ${option.color}`
        return (
            <DropDownItem className={`${(text == select ? 'bg-[#e6e6e6] dark:bg-[#292929]' : '')}`}>
                <TouchableOpacity className={`flex flex-row gap-2 items-center `}
                    onPress={() => handleSelectOption(option)}>
                    <IconCar />
                    <Text className="text-foreground">{text}</Text>
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
                    <ItemDropDown key={option.license_plate.toString()} option={option} />
                )))}
            </DropDownContent>
        </DropDown>
    )
}