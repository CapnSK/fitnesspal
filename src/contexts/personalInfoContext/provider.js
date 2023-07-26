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
        age: undefined
    });

    const value = useMemo(() => ({
        name: personalInfoContext.name,
        email: personalInfoContext.email,
        goal: personalInfoContext.goal,
        weight: personalInfoContext.weight,
        height: personalInfoContext.height,
        fat: personalInfoContext.fat,
        age: personalInfoContext.age,
        setsetPersonalInformationContext: (context) => {
            personalInfoContextSetter(context);
        }
    }), [personalInfoContext.name, personalInfoContext.email, personalInfoContext.goal, personalInfoContext.weight, personalInfoContext.height, personalInfoContext.fat, personalInfoContext.age]);

    return (
        <PersonalInformationContext.Provider value={value}>{children}</PersonalInformationContext.Provider>
    );
}