import { useState, useMemo } from 'react';
import { PersonalInformationContext } from './PersonalInformationContext';

export const PersonalInformationContextProvider = ({ children }) => {
    const [personalInfoContext, personalInfoContextSetter] = useState({
        name: undefined,
        email: undefined,
        goal: undefined,
        weight: undefined,
        height: undefined,
        fat: undefined,
        age: undefined,
        gender: undefined,
        lifestyle: undefined,
    });

    const value = useMemo(() => ({
        name: personalInfoContext.name,
        email: personalInfoContext.email,
        goal: personalInfoContext.goal,
        weight: personalInfoContext.weight,
        height: personalInfoContext.height,
        fat: personalInfoContext.fat,
        age: personalInfoContext.age,
        gender: personalInfoContext.gender,
        lifestyle: personalInfoContext.lifestyle,
        setsetPersonalInformationContext: (context) => {
            personalInfoContextSetter(context);
        }
    }), [personalInfoContext.name, personalInfoContext.email, personalInfoContext.goal, personalInfoContext.weight, personalInfoContext.height, personalInfoContext.fat, personalInfoContext.age, personalInfoContext.gender, personalInfoContext.lifestyle]);

    return (
        <PersonalInformationContext.Provider value={value}>{children}</PersonalInformationContext.Provider>
    );
}