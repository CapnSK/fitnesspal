import { createContext } from "react";

export const PersonalInformationContext = createContext({
    name: undefined,
    email: undefined,
    goal: undefined,
    weight: undefined,
    height: undefined,
    fat: undefined,
    age: undefined,
    gender: undefined,
    lifestyle: undefined,
    setPersonalInformationContext: () => {
        throw new Error("PersonalInformationContext function must have a consumer implementation")
    }
});