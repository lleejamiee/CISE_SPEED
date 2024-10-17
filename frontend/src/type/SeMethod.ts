// Represents the structire of a Claim method object
export type Claim = {
    name: string;
}

// Represents the structure of an SE method object
export type SeMethod = {
    _id: string;
    name: string;
    claims: Claim[]; // Array of claims associated with the SE method
};

// Default structure of SeMethod object with initial values
export const DefaultEmptySeMethod: SeMethod = {
    _id: "",
    name: "",
    claims: [], 
};
